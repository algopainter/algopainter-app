/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RouteRecordRaw } from 'vue-router';
import { i18n } from 'boot/i18n';
import { myStore } from 'src/store';
import UserController from 'src/controllers/user/UserController';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'homePage',
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
                next({ name: 'noUserFound' });
              }
            });
          }
        },
      },
      {
        path: 'auctionsList',
        component: () => import('src/components/auctions/AuctionsList.vue'),
      },
      {
        name: 'bids',
        path: 'bids',
        component: () => import('src/pages/dashboard/bids/Bids.vue'),
        meta: {
          title: i18n.global.t('dashboard.bid.title'),
        },
      },
      {
        name: 'createCollectible',
        path: 'create-collectible',
        component: () => import('src/pages/collectible/Index.vue'),
        meta: {
          title: i18n.global.t('createCollectible.title.main'),
        },
      },
      {
        name: 'newPainting',
        path: 'create-collectible/new-painting/:collection',
        component: () => import('src/pages/dashboard/newpaint/NewPainting.vue'),
        meta: {
          title: i18n.global.t('dashboard.newPainting.title'),
        },
        beforeEnter: (to, from, next) => {
          void myStore.dispatch({
            type: 'mint/collectionData',
            collectionCustomUrl: to.params.collection
          }).then(() => {
            const isCollectionExistent = myStore.getters['mint/GET_COLLECTION_DATA'];

            isCollectionExistent
              ? next()
              : next({ name: '404' });
          });
        },
      },
      {
        name: 'auction',
        path: 'auctions/:id',
        component: () => import('pages/dashboard/auctions/Auction.vue'),
        meta: {
          title: i18n.global.t('dashboard.auctions.title'),
        },
      },
      {
        name: 'viewArt',
        path: 'collections/:id',
        component: () => import('pages/dashboard/viewarts/ViewArt.vue'),
        meta: {
          title: i18n.global.t('dashboard.viewArt.title'),
        },
      },
      {
        name: 'myGallery',
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
        name: 'sellYourArt',
        path: 'sell-your-art/:id',
        component: () => import('pages/dashboard/sellyourart/SellYourArt.vue'),
        meta: {
          title: i18n.global.t('dashboard.sellYourArt.title'),
        },
      },
      {
        name: 'editProfile',
        path: 'edit-profile',
        component: () => import('pages/edit-profile/EditProfile.vue'),
        meta: {
          title: i18n.global.t('dashboard.editProfile.title'),
        },
      },
      {
        name: 'collectiblesGallery',
        path: 'gallery',
        component: () => import('src/pages/collectible/CollectiblesGallery.vue'),
        meta: {
          title: i18n.global.t('dashboard.gallery.title'),
        },
      },
      {
        path: 'create-collection',
        component: () => import('src/pages/create-collection/CreateCollection.vue'),
        meta: {
          title: i18n.global.t('dashboard.createCollection.title'),
        },
        beforeEnter: async(to, from, next) => {
          const account = myStore.state.user.account;
          const userController: UserController = new UserController();

          const result = await userController.getUserProfile(
            account?.toLowerCase() as string
          );

          if (result.isFailure) {
            next({ name: 'editProfile' });
          }

          next();
        },
      },
      {
        path: 'register-nft',
        component: () => import('src/pages/collectible/RegisterExternalNFT.vue'),
        meta: {
          title: i18n.global.t('dashboard.registerExternal.title'),
        },
      },
      {
        path:'report-collection',
        component: () => import('src/pages/dashboard/report-collection/ReportCollection.vue'),
        meta: {
          title: i18n.global.t('dashboard.report.title'),
        }
      },
      {
        path:'report-earnings',
        component: () => import('src/components/home-page/ReportEarnings.vue'),
        meta: {
          title: i18n.global.t('dashboard.reportEarnings.title'),
        }
      },
      {
        path:'validate-collection/',
        component: () => import('src/pages/dashboard/validate-collection/ValidateCollection.vue'),
      },
    ],
  },

  {
    name: 'noUserFound',
    path: '/no-user-found',
    component: () => import('pages/NoUserFound.vue'),
    /*
    beforeEnter: (to, from, next) => {
    */
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
