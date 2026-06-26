import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';

import { UserRoutes } from '../modules/user/user.route';
import { NewsRoutes } from '../modules/news/news.route';
import { FundRoutes } from '../modules/fund/fund.route';
import { GalleryRoutes } from '../modules/gallery/gallery.route';
import { UpcomingEventRoutes } from '../modules/upcomingEvent/upcomingEvent.route';
import { ComplainRoutes } from '../modules/complain/complain.route';
import { ContactRoutes } from '../modules/contact/contact.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', routes: AuthRoutes },
  { path: '/users', routes: UserRoutes },
  { path: '/news', routes: NewsRoutes },
  { path: '/funds', routes: FundRoutes },
  { path: '/gallery', routes: GalleryRoutes },
  { path: '/events', routes: UpcomingEventRoutes },
  { path: '/complains', routes: ComplainRoutes },
  { path: '/contacts', routes: ContactRoutes },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
