import { Routes } from '@angular/router';
import { localeGuard } from './core/i18n/locale.guard';
import { pageTransitionGuard } from './core/navigation/page-transition.guard';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { Shell } from './layout/shell/shell';
import { HomePage } from './features/home/home-page';
import { SolutionsPage } from './features/solutions/solutions-page';
import { ServiceDetailPage } from './features/solutions/service-detail-page';
import { PlaceholderPage } from './shared/ui/placeholder-page/placeholder-page';
import { AdminShell } from './features/admin/admin-shell/admin-shell';
import { AdminLogin } from './features/admin/admin-login/admin-login';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminServicesPage } from './features/admin/admin-services/admin-services';
import { AdminServiceEditPage } from './features/admin/admin-service-edit/admin-service-edit';
import { AdminOfficesPage } from './features/admin/admin-offices/admin-offices';
import { AdminKnowledgePage } from './features/admin/admin-knowledge/admin-knowledge';
import { AdminInboxPage } from './features/admin/admin-inbox/admin-inbox';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'en' },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    component: AdminLogin,
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminShell,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'inbox', component: AdminInboxPage },
      { path: 'services', component: AdminServicesPage },
      { path: 'services/:id', component: AdminServiceEditPage },
      { path: 'offices', component: AdminOfficesPage },
      { path: 'knowledge', component: AdminKnowledgePage },
    ],
  },
  {
    path: ':lang',
    canActivate: [localeGuard],
    canActivateChild: [pageTransitionGuard],
    component: Shell,
    children: [
      { path: '', component: HomePage },
      {
        path: 'solutions',
        children: [
          { path: '', component: SolutionsPage },
          { path: ':slug', component: ServiceDetailPage },
        ],
      },
      {
        path: 'about',
        component: PlaceholderPage,
        data: { titleEn: 'About Us', titleAr: 'من نحن' },
      },
      {
        path: 'blog',
        component: PlaceholderPage,
        data: { titleEn: 'Blogs and Resources', titleAr: 'المدونة والموارد' },
      },
      {
        path: 'careers',
        component: PlaceholderPage,
        data: { titleEn: 'Careers', titleAr: 'الوظائف' },
      },
      {
        path: 'connect',
        component: PlaceholderPage,
        data: { titleEn: 'Connect', titleAr: 'تواصل معنا' },
      },
      {
        path: 'legal/privacy',
        component: PlaceholderPage,
        data: { titleEn: 'Privacy Policy', titleAr: 'سياسة الخصوصية' },
      },
      {
        path: 'legal/terms',
        component: PlaceholderPage,
        data: { titleEn: 'Terms & Conditions', titleAr: 'الشروط والأحكام' },
      },
    ],
  },
  { path: '**', redirectTo: 'en' },
];
