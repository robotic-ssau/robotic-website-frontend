import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAll, getById, getByField, getAllByField, create, update, remove } from '../db/index.js';
import type {
  PostDTO,
  PostDetailedDTO,
  GetPostsResponseDTO,
  GetPostResponseDTO,
  CreatePostRequestDTO,
  CreatePostResponseDTO,
  PatchPostRequestDTO,
  PatchPostResponseDTO,
  ApiErrorDTO,
} from '../types.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Функция для сборки полной информации о посте (JOIN)
async function buildPostDetailed(post: PostDTO): Promise<PostDetailedDTO> {
  // Получаем связанные данные
  const text = await getByField('post_texts', 'post_id', post.id);
  const tags = await getAllByField('post_tags', 'post_id', post.id);
  const photos = await getAllByField('post_photos', 'post_id', post.id);
  const videos = await getAllByField('post_videos', 'post_id', post.id);
  const locations = await getAllByField('post_locations', 'post_id', post.id);
  const survey = await getByField('post_surveys', 'post_id', post.id);

  // Получаем ответы на опрос, если опрос существует
  let surveyWithAnswers;
  if (survey) {
    const answers = await getAllByField('survey_answers', 'survey_id', survey.id);
    surveyWithAnswers = {
      ...survey,
      answers: answers.sort((a, b) => a.index - b.index),
    };
  }

  // Получаем авторов с их профилями
  const postAuthors = await getAllByField('post_authors', 'post_id', post.id);
  const authorsWithProfiles = await Promise.all(
    postAuthors.map(async (author) => {
      const user = await getById('users', author.user_id);
      const profile = await getByField('profiles', 'user_id', author.user_id);
      return {
        ...author,
        user: user!,
        profile,
      };
    }),
  );

  return {
    ...post,
    text,
    tags,
    photos,
    videos,
    locations,
    survey: surveyWithAnswers,
    authors: authorsWithProfiles,
  };
}

// GET /api/posts - получить список всех постов
router.get('/', async (req: Request, res: Response<GetPostsResponseDTO | ApiErrorDTO>) => {
  try {
    const posts = await getAll('posts');

    // Можно вернуть только основную информацию или полную
    // Для списка вернем краткую версию с текстом и тегами
    const postsWithBasicInfo = await Promise.all(
      posts.map(async (post) => {
        const text = await getByField('post_texts', 'post_id', post.id);
        const tags = await getAllByField('post_tags', 'post_id', post.id);
        const photos = await getAllByField('post_photos', 'post_id', post.id);

        return {
          ...post,
          text,
          tags,
          photos: photos.slice(0, 1), // Только первое фото для превью
        };
      }),
    );

    return res.json({ posts: postsWithBasicInfo });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch posts',
    });
  }
});

// GET /api/posts/:id - получить пост по ID с полной информацией (JOIN)
router.get('/:id', async (req: Request, res: Response<GetPostResponseDTO | ApiErrorDTO>) => {
  try {
    const { id } = req.params;
    const post = await getById('posts', id);

    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    const postDetailed = await buildPostDetailed(post);

    return res.json(postDetailed);
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch post',
    });
  }
});

// POST /api/posts - создать новый пост (требует авторизации)
router.post(
  '/',
  authMiddleware,
  async (
    req: Request<{}, {}, CreatePostRequestDTO>,
    res: Response<CreatePostResponseDTO | ApiErrorDTO>,
  ) => {
    try {
      const {
        status,
        type,
        publication_date,
        text: textContent,
        tags,
        photos,
        videos,
        locations,
        survey,
        authors,
      } = req.body;

      if (!status || !type) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Status and type are required',
        });
      }

      // Создаем пост
      const newPost: PostDTO = {
        id: uuidv4(),
        status,
        type,
        publication_date: publication_date || new Date().toISOString(),
      };

      await create('posts', newPost);

      // Создаем текст поста
      if (textContent) {
        await create('post_texts', {
          id: uuidv4(),
          post_id: newPost.id,
          content: textContent,
        });
      }

      // Создаем теги
      if (tags && Array.isArray(tags)) {
        await Promise.all(
          tags.map((tag: string) =>
            create('post_tags', {
              id: uuidv4(),
              post_id: newPost.id,
              tag,
            }),
          ),
        );
      }

      // Создаем фото
      if (photos && Array.isArray(photos)) {
        await Promise.all(
          photos.map((link: string) =>
            create('post_photos', {
              id: uuidv4(),
              post_id: newPost.id,
              link,
            }),
          ),
        );
      }

      // Создаем видео
      if (videos && Array.isArray(videos)) {
        await Promise.all(
          videos.map((link: string) =>
            create('post_videos', {
              id: uuidv4(),
              post_id: newPost.id,
              link,
            }),
          ),
        );
      }

      // Создаем локации
      if (locations && Array.isArray(locations)) {
        type LocationInput = NonNullable<CreatePostRequestDTO['locations']>[number];
        await Promise.all(
          locations.map((loc: LocationInput) =>
            create('post_locations', {
              id: uuidv4(),
              post_id: newPost.id,
              publication_date: loc.publication_date || new Date().toISOString(),
              status: loc.status || status,
              type: loc.type,
              external_id: loc.external_id || '',
            }),
          ),
        );
      }

      // Создаем опрос
      if (survey) {
        const newSurvey = await create('post_surveys', {
          id: uuidv4(),
          post_id: newPost.id,
          type: survey.type,
        });

        // Создаем ответы на опрос
        if (survey.answers && Array.isArray(survey.answers)) {
          type SurveyAnswerInput = NonNullable<CreatePostRequestDTO['survey']>['answers'][number];
          await Promise.all(
            survey.answers.map((answer: SurveyAnswerInput, index: number) =>
              create('survey_answers', {
                id: uuidv4(),
                survey_id: newSurvey.id,
                text: answer.text,
                index: answer.index ?? index,
              }),
            ),
          );
        }
      }

      // Создаем авторов
      if (authors && Array.isArray(authors)) {
        type AuthorInput = NonNullable<CreatePostRequestDTO['authors']>[number];
        await Promise.all(
          authors.map((author: AuthorInput) =>
            create('post_authors', {
              id: uuidv4(),
              user_id: author.user_id,
              post_id: newPost.id,
              type: author.type,
            }),
          ),
        );
      }

      const postDetailed = await buildPostDetailed(newPost);

      return res.status(201).json(postDetailed);
    } catch (error) {
      console.error('Create post error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create post',
      });
    }
  },
);

// PATCH /api/posts/:id - обновить пост (требует авторизации)
router.patch(
  '/:id',
  authMiddleware,
  async (
    req: Request<{ id: string }, {}, PatchPostRequestDTO>,
    res: Response<PatchPostResponseDTO | ApiErrorDTO>,
  ) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const post = await getById('posts', id);
      if (!post) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Post not found',
        });
      }

      // Обновляем основные поля поста
      const { text, tags, photos, videos, ...postUpdates } = updates;

      if (Object.keys(postUpdates).length > 0) {
        await update('posts', id, postUpdates);
      }

      // Обновляем текст
      if (text !== undefined) {
        const existingText = await getByField('post_texts', 'post_id', id);
        if (existingText) {
          await update('post_texts', existingText.id, { content: text });
        } else {
          await create('post_texts', {
            id: uuidv4(),
            post_id: id,
            content: text,
          });
        }
      }

      const updatedPost = await getById('posts', id);
      const postDetailed = await buildPostDetailed(updatedPost!);

      return res.json(postDetailed);
    } catch (error) {
      console.error('Update post error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update post',
      });
    }
  },
);

// DELETE /api/posts/:id - удалить пост (требует авторизации)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await getById('posts', id);
    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    // Удаляем все связанные данные
    const text = await getByField('post_texts', 'post_id', id);
    if (text) await remove('post_texts', text.id);

    const tags = await getAllByField('post_tags', 'post_id', id);
    await Promise.all(tags.map((tag) => remove('post_tags', tag.id)));

    const photos = await getAllByField('post_photos', 'post_id', id);
    await Promise.all(photos.map((photo) => remove('post_photos', photo.id)));

    const videos = await getAllByField('post_videos', 'post_id', id);
    await Promise.all(videos.map((video) => remove('post_videos', video.id)));

    const locations = await getAllByField('post_locations', 'post_id', id);
    await Promise.all(locations.map((loc) => remove('post_locations', loc.id)));

    const survey = await getByField('post_surveys', 'post_id', id);
    if (survey) {
      const answers = await getAllByField('survey_answers', 'survey_id', survey.id);
      await Promise.all(answers.map((answer) => remove('survey_answers', answer.id)));
      await remove('post_surveys', survey.id);
    }

    const authors = await getAllByField('post_authors', 'post_id', id);
    await Promise.all(authors.map((author) => remove('post_authors', author.id)));

    // Удаляем сам пост
    await remove('posts', id);

    return res.status(204).send();
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete post',
    });
  }
});

export default router;
