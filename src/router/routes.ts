/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RouteRecordRaw } from 'vue-router';
import { i18n } from 'boot/i18n';
import { myStore } from 'src/store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'homepage',
        path: '',
        component: () => import('pages/dashboard/HomePage.vue'),
      },
      {
        name: 'customUrl',
        path: 'user/:customUrl',
        component: () => import('src/pages/dashboard/user-gallery/UserGallery.vue'),
        meta: {
          title: i18n.global.t('dashboard.homePage.publicTitle'),
        },
        beforeEnter: (to, from, next) => {
          if (to.params.customUrl.slice(0, 2) === '0x') { // In case the profile clicked does not have an customized url
            to.params.account = to.params.customUrl;
            next();
          } else { // In case the user typed the customUrl or right cliked an avatar
            void myStore.dispatch({
              type: 'user/getAccountBasedOnCustomUrl',
              customUrl: to.params.customUrl,
            }).then(() => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              const userAccount: string = myStore.getters['user/GET_USER_ACCOUNT'];
              if (userAccount) {
                to.params.account = userAccount;
                next();
              } else {
                next({ name: '404' });
              }
            });
          }
        },
      },
      {
        path: 'auctions',
        component: () => import('src/components/auctions/AuctionsList.vue'),
      },
      {
        path: 'bids',
        component: () => import('src/pages/dashboard/bids/Bids.vue'),
        meta: {
          title: i18n.global.t('dashboard.bid.title'),
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
          title: i18n.global.t('dashboard.auctions.title'),
        },
      },
      {
        path: 'collections/:id',
        component: () => import('pages/dashboard/viewarts/ViewArt.vue'),
        meta: {
          title: i18n.global.t('dashboard.viewArt.title'),
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
        path: 'my-gallery',
        component: () => import('pages/dashboard/gallery/MyGallery.vue'),
        meta: {
          title: i18n.global.t('dashboard.homePage.title'),
        },
      },
      /*
      {
        path: 'user-gallery',
        component: () => import('src/pages/dashboard/user-gallery/UserGallery.vue'),
        meta: {
          title: i18n.global.t('dashboard.homePage.publicTitle'),
        },
      },
      */
      {
        path: 'sell-your-art/:id',
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
    name: '404',
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
    /*
    beforeEnter: (to, from, next) => {
    */
  },
];

export default routes;
