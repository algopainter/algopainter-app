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
      {
        path: 'auctions/:id',
        component: () => import('pages/dashboard/auctions/Auction.vue'),
        meta: {
          title: i18n.global.t('dashboard.dashboard.collectiblesGallery'),
        },
      },
      {
        path: 'new-painting',
        component: () => import('pages/dashboard/newpaint/NewPainting.vue'),
        meta: {
          title: i18n.global.t('dashboard.newPainting.title'),
        },
      },
      {
        path: 'sell-your-art',
        component: () => import('pages/dashboard/sellyourart/SellYourArt.vue'),
        meta: {
          title: i18n.global.t('dashboard.sellYourArt.title'),
        },
      },
      {
        path: 'edit-profile',
        component: () => import('pages/edit-profile/EditProfile.vue'),
        meta: {
          title: i18n.global.t('dashboard.editProfile.title'),
        },
      },
      {
        path: 'gallery',
        component: () => import('src/pages/collectible/CollectiblesGallery.vue'),
        meta: {
          title: i18n.global.t('dashboard.gallery.title'),
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
