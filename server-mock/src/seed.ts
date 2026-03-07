import { v4 as uuidv4 } from 'uuid';
import { initDB, create } from './db/index.js';
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
} from './types.js';

async function seed() {
  console.log('🌱 Starting database seeding...');

  await initDB();

  // Создаем роли
  console.log('Creating roles...');
  const roles: RoleDTO[] = [
    { id: uuidv4(), name: ROLE_TYPE_DTO.ADMIN },
    { id: uuidv4(), name: ROLE_TYPE_DTO.USER },
    { id: uuidv4(), name: ROLE_TYPE_DTO.SMM },
    { id: uuidv4(), name: ROLE_TYPE_DTO.COUNCIL },
    { id: uuidv4(), name: ROLE_TYPE_DTO.OWNER },
  ];

  for (const role of roles) {
    // eslint-disable-next-line no-await-in-loop
    await create('roles', role);
  }

  // Создаем пользователей
  console.log('Creating users...');

  // 1. Администратор
  const adminUser: UserDTO = {
    id: uuidv4(),
    username: 'admin',
    password: 'admin123',
    active: true,
  };
  await create('users', adminUser);

  const adminProfile: ProfileDTO = {
    id: uuidv4(),
    user_id: adminUser.id,
    first_name: 'Иван',
    second_name: 'Иванов',
    middle_name: 'Иванович',
    phone: '+79001234567',
    email: 'admin@robotic.ru',
    group: 'Администрация',
    vk_id: 'admin_vk',
    telegram_id: '@admin_tg',
  };
  await create('profiles', adminProfile);

  const adminRoleLink: UserRoleDTO = {
    id: uuidv4(),
    user_id: adminUser.id,
    role_id: roles.find((r) => r.name === ROLE_TYPE_DTO.ADMIN)!.id,
  };
  await create('user_roles', adminRoleLink);

  // 2. SMM менеджер
  const smmUser: UserDTO = {
    id: uuidv4(),
    username: 'smm_manager',
    password: 'smm123',
    active: true,
  };
  await create('users', smmUser);

  const smmProfile: ProfileDTO = {
    id: uuidv4(),
    user_id: smmUser.id,
    first_name: 'Мария',
    second_name: 'Петрова',
    middle_name: 'Сергеевна',
    phone: '+79009876543',
    email: 'smm@robotic.ru',
    group: 'Маркетинг',
    vk_id: 'smm_vk',
    telegram_id: '@smm_tg',
  };
  await create('profiles', smmProfile);

  const smmRoleLink: UserRoleDTO = {
    id: uuidv4(),
    user_id: smmUser.id,
    role_id: roles.find((r) => r.name === ROLE_TYPE_DTO.SMM)!.id,
  };
  await create('user_roles', smmRoleLink);

  // 3. Обычный пользователь
  const regularUser: UserDTO = {
    id: uuidv4(),
    username: 'user',
    password: 'user123',
    active: true,
  };
  await create('users', regularUser);

  const regularProfile: ProfileDTO = {
    id: uuidv4(),
    user_id: regularUser.id,
    first_name: 'Алексей',
    second_name: 'Смирнов',
    middle_name: 'Дмитриевич',
    phone: '+79005556677',
    email: 'user@robotic.ru',
    group: 'РТФ-41',
    vk_id: 'user_vk',
    telegram_id: '@user_tg',
  };
  await create('profiles', regularProfile);

  const userRoleLink: UserRoleDTO = {
    id: uuidv4(),
    user_id: regularUser.id,
    role_id: roles.find((r) => r.name === ROLE_TYPE_DTO.USER)!.id,
  };
  await create('user_roles', userRoleLink);

  // Создаем посты
  console.log('Creating posts...');

  // Пост 1: Опубликованная статья с опросом
  const post1: PostDTO = {
    id: uuidv4(),
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_TYPE_DTO.ARTICLE,
    publication_date: new Date('2024-03-01T10:00:00Z').toISOString(),
  };
  await create('posts', post1);

  const post1Text: PostTextDTO = {
    id: uuidv4(),
    post_id: post1.id,
    content:
      'Приглашаем всех студентов на открытое занятие по робототехнике! Мы расскажем о последних достижениях в области искусственного интеллекта и покажем наших роботов в действии.',
  };
  await create('post_texts', post1Text);

  await create('post_tags', { id: uuidv4(), post_id: post1.id, tag: 'робототехника' });
  await create('post_tags', { id: uuidv4(), post_id: post1.id, tag: 'обучение' });
  await create('post_tags', { id: uuidv4(), post_id: post1.id, tag: 'ИИ' });

  await create('post_photos', {
    id: uuidv4(),
    post_id: post1.id,
    link: 'https://picsum.photos/800/600?random=1',
  });

  await create('post_locations', {
    id: uuidv4(),
    post_id: post1.id,
    publication_date: post1.publication_date,
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_LOCATION_DTO.WEBSITE,
    external_id: '',
  });

  await create('post_locations', {
    id: uuidv4(),
    post_id: post1.id,
    publication_date: post1.publication_date,
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_LOCATION_DTO.VK,
    external_id: 'vk_post_123',
  });

  const survey1 = await create('post_surveys', {
    id: uuidv4(),
    post_id: post1.id,
    type: SURVERY_TYPE_DTO.SINGLE,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey1.id,
    text: 'Да, обязательно приду!',
    index: 0,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey1.id,
    text: 'Возможно, если будет время',
    index: 1,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey1.id,
    text: 'Нет, не смогу',
    index: 2,
  });

  await create('post_authors', {
    id: uuidv4(),
    user_id: smmUser.id,
    post_id: post1.id,
    type: POST_AUTHOR_TYPE_DTO.TEXT,
  });

  // Пост 2: Обычный пост с фото и видео
  const post2: PostDTO = {
    id: uuidv4(),
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_TYPE_DTO.POST,
    publication_date: new Date('2024-03-05T14:30:00Z').toISOString(),
  };
  await create('posts', post2);

  const post2Text: PostTextDTO = {
    id: uuidv4(),
    post_id: post2.id,
    content:
      'Наша команда заняла первое место на соревнованиях по робототехнике! 🏆 Спасибо всем за поддержку!',
  };
  await create('post_texts', post2Text);

  await create('post_tags', { id: uuidv4(), post_id: post2.id, tag: 'достижения' });
  await create('post_tags', { id: uuidv4(), post_id: post2.id, tag: 'соревнования' });

  await create('post_photos', {
    id: uuidv4(),
    post_id: post2.id,
    link: 'https://picsum.photos/800/600?random=2',
  });

  await create('post_photos', {
    id: uuidv4(),
    post_id: post2.id,
    link: 'https://picsum.photos/800/600?random=3',
  });

  await create('post_videos', {
    id: uuidv4(),
    post_id: post2.id,
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  });

  await create('post_locations', {
    id: uuidv4(),
    post_id: post2.id,
    publication_date: post2.publication_date,
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_LOCATION_DTO.TELEGRAM,
    external_id: 'tg_msg_456',
  });

  await create('post_authors', {
    id: uuidv4(),
    user_id: adminUser.id,
    post_id: post2.id,
    type: POST_AUTHOR_TYPE_DTO.TEXT,
  });

  await create('post_authors', {
    id: uuidv4(),
    user_id: adminUser.id,
    post_id: post2.id,
    type: POST_AUTHOR_TYPE_DTO.PHOTO,
  });

  // Пост 3: Черновик
  const post3: PostDTO = {
    id: uuidv4(),
    status: POST_STATUS_DTO.DRAFT,
    type: POST_TYPE_DTO.POST,
    publication_date: new Date().toISOString(),
  };
  await create('posts', post3);

  const post3Text: PostTextDTO = {
    id: uuidv4(),
    post_id: post3.id,
    content: 'Предстоящее мероприятие... (в разработке)',
  };
  await create('post_texts', post3Text);

  await create('post_tags', { id: uuidv4(), post_id: post3.id, tag: 'черновик' });

  await create('post_authors', {
    id: uuidv4(),
    user_id: smmUser.id,
    post_id: post3.id,
    type: POST_AUTHOR_TYPE_DTO.TEXT,
  });

  // Пост 4: Запланированная публикация
  const post4: PostDTO = {
    id: uuidv4(),
    status: POST_STATUS_DTO.SCHEDULED,
    type: POST_TYPE_DTO.ARTICLE,
    publication_date: new Date('2024-04-01T09:00:00Z').toISOString(),
  };
  await create('posts', post4);

  const post4Text: PostTextDTO = {
    id: uuidv4(),
    post_id: post4.id,
    content:
      'Анонсируем новый курс по программированию микроконтроллеров. Начало занятий в апреле!',
  };
  await create('post_texts', post4Text);

  await create('post_tags', { id: uuidv4(), post_id: post4.id, tag: 'курсы' });
  await create('post_tags', { id: uuidv4(), post_id: post4.id, tag: 'программирование' });

  await create('post_photos', {
    id: uuidv4(),
    post_id: post4.id,
    link: 'https://picsum.photos/800/600?random=4',
  });

  await create('post_authors', {
    id: uuidv4(),
    user_id: regularUser.id,
    post_id: post4.id,
    type: POST_AUTHOR_TYPE_DTO.TEXT,
  });

  // Пост 5: Пост с множественным опросом
  const post5: PostDTO = {
    id: uuidv4(),
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_TYPE_DTO.POST,
    publication_date: new Date('2024-03-10T16:00:00Z').toISOString(),
  };
  await create('posts', post5);

  const post5Text: PostTextDTO = {
    id: uuidv4(),
    post_id: post5.id,
    content:
      'Какие направления робототехники вас интересуют больше всего? (можно выбрать несколько)',
  };
  await create('post_texts', post5Text);

  await create('post_tags', { id: uuidv4(), post_id: post5.id, tag: 'опрос' });
  await create('post_tags', { id: uuidv4(), post_id: post5.id, tag: 'направления' });

  const survey5 = await create('post_surveys', {
    id: uuidv4(),
    post_id: post5.id,
    type: SURVERY_TYPE_DTO.MULTIPLE,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey5.id,
    text: 'Искусственный интеллект',
    index: 0,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey5.id,
    text: 'Промышленная робототехника',
    index: 1,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey5.id,
    text: 'Мобильные роботы',
    index: 2,
  });

  await create('survey_answers', {
    id: uuidv4(),
    survey_id: survey5.id,
    text: 'Дроны и БПЛА',
    index: 3,
  });

  await create('post_locations', {
    id: uuidv4(),
    post_id: post5.id,
    publication_date: post5.publication_date,
    status: POST_STATUS_DTO.PUBLISHED,
    type: POST_LOCATION_DTO.VK,
    external_id: 'vk_poll_789',
  });

  await create('post_authors', {
    id: uuidv4(),
    user_id: smmUser.id,
    post_id: post5.id,
    type: POST_AUTHOR_TYPE_DTO.SURVEY,
  });

  console.log('✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  Admin:   username: admin, password: admin123');
  console.log('  SMM:     username: smm_manager, password: smm123');
  console.log('  User:    username: user, password: user123');
  console.log('\nCreated 3 users with different roles and 5 posts with various content types.');
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
