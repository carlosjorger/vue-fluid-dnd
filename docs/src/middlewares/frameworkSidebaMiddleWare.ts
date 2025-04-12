import { FRAMEWORKS_TEMPLATE, FRAMEWORKS_TYPES } from '@/types';
import { getFrameworkFromUrl } from '@/utils/frameworkConfig';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { URL } from 'url';

type InnerEntry ={
  href: string
}
type SidebarWithInnerEntry={
  entries: InnerEntry[]
}

export const onRequest = defineRouteMiddleware((context) => {
  const { pathname } = context.url;
  const url = new URL(context.request.url);
  const currentFramework = getFrameworkFromUrl(pathname);
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
