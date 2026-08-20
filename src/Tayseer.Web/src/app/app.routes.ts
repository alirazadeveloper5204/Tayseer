import { Routes } from '@angular/router';
import { localeGuard } from './core/i18n/locale.guard';
import { localeMatcher } from './core/i18n/locale.matcher';
import { pageTransitionGuard } from './core/navigation/page-transition.guard';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { Shell } from './layout/shell/shell';
import { HomePage } from './features/home/home-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'en' },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/admin/admin-login/admin-login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./features/admin/admin-inbox/admin-inbox').then((m) => m.AdminInboxPage),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/admin/admin-services/admin-services').then((m) => m.AdminServicesPage),
      },
      {
        path: 'services/:id',
        loadComponent: () =>
          import('./features/admin/admin-service-edit/admin-service-edit').then(
            (m) => m.AdminServiceEditPage,
          ),
      },
      {
        path: 'offices',
        loadComponent: () =>
          import('./features/admin/admin-offices/admin-offices').then((m) => m.AdminOfficesPage),
      },
      {
        path: 'knowledge',
        loadComponent: () =>
          import('./features/admin/admin-knowledge/admin-knowledge').then(
            (m) => m.AdminKnowledgePage,
          ),
      },
    ],
  },
  {
    matcher: localeMatcher,
    canActivate: [localeGuard],
    canActivateChild: [pageTransitionGuard],
    component: Shell,
    children: [
      { path: '', component: HomePage },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/services/services-page').then((m) => m.ServicesPage),
      },
      {
        path: 'software-development',
        loadComponent: () =>
          import('./features/software/software-page').then((m) => m.SoftwarePage),
      },
      {
        path: 'managed-services',
        loadComponent: () =>
          import('./features/managed/managed-page').then((m) => m.ManagedPage),
      },
      {
        path: 'solutions',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/solutions/solutions-page').then((m) => m.SolutionsPage),
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/solutions/service-detail-page').then((m) => m.ServiceDetailPage),
          },
        ],
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
      },
      {
        path: 'case-studies',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/case-studies/case-studies-page').then((m) => m.CaseStudiesPage),
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/case-studies/case-study-detail-page').then(
                (m) => m.CaseStudyDetailPage,
              ),
          },
        ],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact-page').then((m) => m.ContactPage),
      },
      { path: 'connect', redirectTo: 'contact', pathMatch: 'full' },
      {
        path: 'faqs',
        loadComponent: () => import('./features/faqs/faqs-page').then((m) => m.FaqsPage),
      },
      { path: 'blog', redirectTo: 'faqs', pathMatch: 'full' },
      {
        path: 'careers',
        loadComponent: () =>
          import('./features/careers/careers-page').then((m) => m.CareersPage),
      },
      {
        path: 'legal/privacy',
        loadComponent: () =>
          import('./features/legal/legal-page').then((m) => m.LegalPage),
        data: { doc: 'privacy' },
      },
      {
        path: 'legal/terms',
        loadComponent: () =>
          import('./features/legal/legal-page').then((m) => m.LegalPage),
        data: { doc: 'terms' },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
