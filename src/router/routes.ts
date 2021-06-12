import { RouteRecordRaw } from 'vue-router';

import { i18n } from 'boot/i18n';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/HomePage.vue'),
        meta: {
          title: i18n.global.t('dashboard.homePage.title'),
        },
      },
      {
        path: 'auctions',
        component: () => import('pages/dashboard/auctions/AuctionsList.vue'),
        meta: {
          title: i18n.global.t('dashboard.auctions.title'),
        },
      },
      {
        path: 'create-collectible',
        component: () => import('src/pages/collectible/Index.vue'),
        meta: {
          title: i18n.global.t('createCollectible.title.main'),
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
