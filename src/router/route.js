export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/my',
        name: 'My',
        component: () => import('../views/My.vue')
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/Menu.vue')
      },
      {
        path: '/shopbag',
        name: 'Shopbag',
        component: () => import('../views/Shopbag.vue')
      },
    ]
  },
  {
    path: '/detail/:pid',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('../views/Pay.vue')
  },
  {
    path: '/newaddress',
    name: 'NewAddress',
    component: () => import('../views/NewAddress.vue')
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue')
  },
  {
    path: '/like',
    name: 'Like',
    component: () => import('../views/Like.vue')
  }, {
    path: '/secure',
    name: 'Secure',
    component: () => import('../views/Secure.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },

  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/Forgot.vue')
  },
  // 重定向
  {
    path: '*',
    redirect: {
      name: "Home"
    }
  }
]