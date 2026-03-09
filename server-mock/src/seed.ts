import { v4 as uuidv4 } from 'uuid';
import { fakerRU as faker } from '@faker-js/faker';
import { initDB, create, readDB, writeDB } from './db/index.js';
import {
  ROLE_TYPE_DTO,
  POST_STATUS_DTO,
  POST_TYPE_DTO,
  POST_LOCATION_DTO,
  SURVERY_TYPE_DTO,
  POST_AUTHOR_TYPE_DTO,
  type UserDTO,
  type RoleDTO,
  type UserRoleDTO,
  type ProfileDTO,
  type PostDTO,
  type PostTextDTO,
  type PostTagDTO,
  type PostPhotoDTO,
  type PostVideoDTO,
  type PostLocationDTO,
  type PostSurveyDTO,
  type SurveyAnswerDTO,
  type PostAuthorDTO,
} from './types.js';

const DEFAULT_USERS_COUNT = 75;
const DEFAULT_POSTS_COUNT = 500;

/** Парсит аргументы: seed [usersCount] [postsCount] */
function parseArgs(): { usersCount: number; postsCount: number } {
  const args = process.argv.slice(2).map((a) => parseInt(a, 10)).filter((n) => !Number.isNaN(n));
  const usersCount = Math.max(3, Math.min(100, args[0] ?? DEFAULT_USERS_COUNT));
  const postsCount = Math.max(1, args[1] ?? DEFAULT_POSTS_COUNT);
  return { usersCount, postsCount };
}

/** Роли, которые могут быть авторами постов (не USER, не ANONYMOUS) */
const AUTHOR_ROLES = [
  ROLE_TYPE_DTO.ADMIN,
  ROLE_TYPE_DTO.SMM,
  ROLE_TYPE_DTO.COUNCIL,
  ROLE_TYPE_DTO.OWNER,
] as const;

async function seed() {
  const { usersCount, postsCount } = parseArgs();
  console.log('🌱 Starting database seeding...');
  console.log(`   Users: ${usersCount}, Posts: ${postsCount}`);

  await initDB();

  // Сброс данных перед сидом (чистые массивы)
  const data = await readDB();
  data.users = [];
  data.roles = [];
  data.user_roles = [];
  data.profiles = [];
  data.posts = [];
  data.post_tags = [];
  data.post_photos = [];
  data.post_videos = [];
  data.post_texts = [];
  data.post_locations = [];
  data.post_surveys = [];
  data.survey_answers = [];
  data.post_authors = [];
  await writeDB();

  // Роли
  console.log('Creating roles...');
  const roles: RoleDTO[] = [
    { id: uuidv4(), name: ROLE_TYPE_DTO.ADMIN },
    { id: uuidv4(), name: ROLE_TYPE_DTO.USER },
    { id: uuidv4(), name: ROLE_TYPE_DTO.SMM },
    { id: uuidv4(), name: ROLE_TYPE_DTO.COUNCIL },
    { id: uuidv4(), name: ROLE_TYPE_DTO.OWNER },
  ];
  for (const role of roles) {
    await create('roles', role);
  }

  const getRoleId = (name: (typeof roles)[number]['name']) => roles.find((r) => r.name === name)!.id;

  // Пул авторов: id пользователей с ролью ADMIN/SMM/COUNCIL/OWNER (будут использоваться в post_authors)
  const authorUserIds: string[] = [];

  // Фиксированные пользователи (тестовые логины)
  console.log('Creating fixed users...');
  const fixedUsers: Array<{ user: UserDTO; profile: ProfileDTO; roleName: (typeof roles)[number]['name'] }> = [
    {
      user: { id: uuidv4(), username: 'admin', password: 'admin123', active: true },
      profile: {
        id: uuidv4(),
        user_id: '',
        first_name: 'Иван',
        second_name: 'Иванов',
        middle_name: 'Иванович',
        phone: '+79001234567',
        email: 'admin@robotic.ru',
        group: 'Администрация',
        vk_id: 'admin_vk',
        telegram_id: '@admin_tg',
      },
      roleName: ROLE_TYPE_DTO.ADMIN,
    },
    {
      user: { id: uuidv4(), username: 'smm_manager', password: 'smm123', active: true },
      profile: {
        id: uuidv4(),
        user_id: '',
        first_name: 'Мария',
        second_name: 'Петрова',
        middle_name: 'Сергеевна',
        phone: '+79009876543',
        email: 'smm@robotic.ru',
        group: 'Маркетинг',
        vk_id: 'smm_vk',
        telegram_id: '@smm_tg',
      },
      roleName: ROLE_TYPE_DTO.SMM,
    },
    {
      user: { id: uuidv4(), username: 'user', password: 'user123', active: true },
      profile: {
        id: uuidv4(),
        user_id: '',
        first_name: 'Алексей',
        second_name: 'Смирнов',
        middle_name: 'Дмитриевич',
        phone: '+79005556677',
        email: 'user@robotic.ru',
        group: 'РТФ-41',
        vk_id: 'user_vk',
        telegram_id: '@user_tg',
      },
      roleName: ROLE_TYPE_DTO.USER,
    },
  ];

  for (const { user, profile, roleName } of fixedUsers) {
    profile.user_id = user.id;
    await create('users', user);
    await create('profiles', profile);
    const userRole: UserRoleDTO = {
      id: uuidv4(),
      user_id: user.id,
      role_id: getRoleId(roleName),
    };
    await create('user_roles', userRole);
    if (AUTHOR_ROLES.includes(roleName as (typeof AUTHOR_ROLES)[number])) {
      authorUserIds.push(user.id);
    }
  }

  // Faker-пользователи
  const fakerCount = usersCount - 3;
  const authorPoolSize = Math.min(15, Math.max(0, fakerCount)); // первые 15 фейковых — авторы

  console.log(`Creating ${fakerCount} faker users (${authorPoolSize} as authors)...`);
  for (let i = 0; i < fakerCount; i++) {
    const userId = uuidv4();
    const user: UserDTO = {
      id: userId,
      username: `user_${i}_${faker.string.alphanumeric(6)}`,
      password: `password${i}`,
      active: faker.datatype.boolean(0.95),
    };
    await create('users', user);

    const profile: ProfileDTO = {
      id: uuidv4(),
      user_id: userId,
      first_name: faker.person.firstName(),
      second_name: faker.person.lastName(),
      middle_name: faker.person.middleName(),
      phone: `+7 9${faker.string.numeric(2)} ${faker.string.numeric(3)} ${faker.string.numeric(2)} ${faker.string.numeric(2)}`,
      email: faker.internet.email({ firstName: user.username }).toLowerCase(),
      group: `Группа ${faker.string.numeric(2)}-${faker.string.numeric(2)}`,
      vk_id: faker.string.alphanumeric(8),
      telegram_id: `@${faker.string.alphanumeric(9)}`,
    };
    await create('profiles', profile);

    const roleName =
      i < authorPoolSize
        ? faker.helpers.arrayElement(AUTHOR_ROLES)
        : ROLE_TYPE_DTO.USER;
    const userRole: UserRoleDTO = {
      id: uuidv4(),
      user_id: userId,
      role_id: getRoleId(roleName),
    };
    await create('user_roles', userRole);
    if (i < authorPoolSize) {
      authorUserIds.push(userId);
    }
  }

  if (authorUserIds.length === 0) {
    throw new Error('Author pool is empty; at least one user with ADMIN/SMM/COUNCIL/OWNER is required for posts.');
  }

  // Посты
  const statuses = [
    POST_STATUS_DTO.PUBLISHED,
    POST_STATUS_DTO.PUBLISHED,
    POST_STATUS_DTO.PUBLISHED,
    POST_STATUS_DTO.DRAFT,
    POST_STATUS_DTO.SCHEDULED,
  ];
  const postTypes = [POST_TYPE_DTO.POST, POST_TYPE_DTO.ARTICLE];
  const locationTypes = [POST_LOCATION_DTO.WEBSITE, POST_LOCATION_DTO.VK, POST_LOCATION_DTO.TELEGRAM];
  const authorTypes = [
    POST_AUTHOR_TYPE_DTO.TEXT,
    POST_AUTHOR_TYPE_DTO.PHOTO,
    POST_AUTHOR_TYPE_DTO.VIDEO,
    POST_AUTHOR_TYPE_DTO.SURVEY,
  ];
  const tagPool = [
    'робототехника',
    'обучение',
    'ИИ',
    'достижения',
    'соревнования',
    'курсы',
    'программирование',
    'опрос',
    'направления',
    'мероприятия',
    'лаборатория',
    'студенты',
    'проект',
    'конференция',
    'хакатон',
  ];

  console.log(`Creating ${postsCount} posts...`);
  for (let i = 0; i < postsCount; i++) {
    const postId = uuidv4();
    const status = faker.helpers.arrayElement(statuses);
    const type = faker.helpers.arrayElement(postTypes);
    const publicationDate = faker.date.between({ from: '2023-01-01', to: '2025-12-31' }).toISOString();

    const post: PostDTO = {
      id: postId,
      status,
      type,
      publication_date: publicationDate,
    };
    await create('posts', post);

    const postText: PostTextDTO = {
      id: uuidv4(),
      post_id: postId,
      content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    };
    await create('post_texts', postText);

    const tagCount = faker.number.int({ min: 0, max: 5 });
    const chosenTags = faker.helpers.arrayElements(tagPool, { min: tagCount, max: tagCount });
    for (const tag of chosenTags) {
      const postTag: PostTagDTO = { id: uuidv4(), post_id: postId, tag };
      await create('post_tags', postTag);
    }

    const photoCount = faker.number.int({ min: 0, max: 3 });
    for (let p = 0; p < photoCount; p++) {
      const postPhoto: PostPhotoDTO = {
        id: uuidv4(),
        post_id: postId,
        link: `https://picsum.photos/800/600?random=${postId.slice(0, 8)}${p}`,
      };
      await create('post_photos', postPhoto);
    }

    if (faker.datatype.boolean(0.3)) {
      const postVideo: PostVideoDTO = {
        id: uuidv4(),
        post_id: postId,
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      };
      await create('post_videos', postVideo);
    }

    const locCount = faker.number.int({ min: 0, max: 2 });
    for (let l = 0; l < locCount; l++) {
      const locType = faker.helpers.arrayElement(locationTypes);
      const postLocation: PostLocationDTO = {
        id: uuidv4(),
        post_id: postId,
        publication_date: publicationDate,
        status,
        type: locType,
        external_id: locType !== POST_LOCATION_DTO.WEBSITE ? faker.string.alphanumeric(10) : '',
      };
      await create('post_locations', postLocation);
    }

    if (faker.datatype.boolean(0.1)) {
      const surveyType = faker.helpers.arrayElement([
        SURVERY_TYPE_DTO.SINGLE,
        SURVERY_TYPE_DTO.MULTIPLE,
      ]);
      const survey: PostSurveyDTO = {
        id: uuidv4(),
        post_id: postId,
        type: surveyType,
      };
      const createdSurvey = await create('post_surveys', survey);
      const answerCount = faker.number.int({ min: 2, max: 5 });
      for (let a = 0; a < answerCount; a++) {
        const answer: SurveyAnswerDTO = {
          id: uuidv4(),
          survey_id: createdSurvey.id,
          text: faker.lorem.sentence(),
          index: a,
        };
        await create('survey_answers', answer);
      }
    }

    const numAuthors = faker.number.int({ min: 1, max: 2 });
    const selectedAuthorIds = faker.helpers.arrayElements(authorUserIds, { min: numAuthors, max: numAuthors });
    for (const uid of selectedAuthorIds) {
      const postAuthor: PostAuthorDTO = {
        id: uuidv4(),
        user_id: uid,
        post_id: postId,
        type: faker.helpers.arrayElement(authorTypes),
      };
      await create('post_authors', postAuthor);
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  Admin:   username: admin, password: admin123');
  console.log('  SMM:     username: smm_manager, password: smm123');
  console.log('  User:    username: user, password: user123');
  console.log(`\nCreated ${usersCount} users and ${postsCount} posts.`);
  console.log('Usage: npm run seed [usersCount] [postsCount] (defaults: 75 500)');
}

seed()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
