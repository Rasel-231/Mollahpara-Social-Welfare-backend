import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { MemberRoutes } from '../modules/member/member.route';
import { NewsRoutes } from '../modules/news/news.route';
import { FundRoutes } from '../modules/fund/fund.route';
import { GalleryRoutes } from '../modules/gallery/gallery.route';
import { UpcomingEventRoutes } from '../modules/upcomingEvent/upcomingEvent.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', routes: AuthRoutes },
  { path: '/members', routes: MemberRoutes },
  { path: '/news', routes: NewsRoutes },
  { path: '/funds', routes: FundRoutes },
  { path: '/gallery', routes: GalleryRoutes },
  { path: '/events', routes: UpcomingEventRoutes },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
