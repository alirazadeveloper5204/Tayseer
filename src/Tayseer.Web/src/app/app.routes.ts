import { Routes } from '@angular/router';
import { localeGuard } from './core/i18n/locale.guard';
import { pageTransitionGuard } from './core/navigation/page-transition.guard';
import { Shell } from './layout/shell/shell';
import { HomePage } from './features/home/home-page';
import { SolutionsPage } from './features/solutions/solutions-page';
import { ServiceDetailPage } from './features/solutions/service-detail-page';
import { PlaceholderPage } from './shared/ui/placeholder-page/placeholder-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'en' },
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
