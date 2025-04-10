import { FRAMEWORKS_TEMPLATE, FRAMEWORKS_TYPES } from '@/types';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

type InnerEntry ={
  href: string
}
type SidebarWithInnerEntry={
  entries: InnerEntry[]
}

export const onRequest = defineRouteMiddleware((context) => {
	// Get the base path of the current URL
  
  const { locale } = context.locals.starlightRoute;
  const { pathname } = context.url;
  const lang = locale?`/${locale}`:'/'
	const currentBase = pathname.slice(lang.length).split('/').filter(path => path)[0];
  const currentFramework = currentBase?? FRAMEWORKS_TYPES.vue;
	// Filter our sidebar groups that do not include links to the current product.
  const items = context.locals.starlightRoute.sidebar
  for (const item of items) {
    var sidebarWithInnerEntry = item as SidebarWithInnerEntry;
    if (!sidebarWithInnerEntry) {
      continue;
    }
    if (!sidebarWithInnerEntry.entries) {
      continue;
    }
    for (const element of [...sidebarWithInnerEntry.entries]) {
      if (element.href) {
        element.href = element.href.replace(FRAMEWORKS_TEMPLATE, currentFramework)
      }
    }
  }
});
