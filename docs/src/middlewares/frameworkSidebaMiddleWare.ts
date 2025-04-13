import { FRAMEWORKS_TEMPLATE, FRAMEWORKS_TYPES } from '@/types';
import { getFrameworkFromUrl } from '@/utils/frameworkConfig';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { SidebarEntry } from 'node_modules/@astrojs/starlight/utils/routing/types';

type InnerEntry ={
  href: string
}
type SidebarWithInnerEntry={
  entries: InnerEntry[]
}
const filterSidebarByFramework = (framework:string, sidebar: SidebarEntry[] )=>sidebar.filter(
  (group) =>
    group.type === 'group' &&
    group.entries.some(
      (entry) => entry.type === 'link' && entry.href.includes(framework)
    )
)

export const onRequest = defineRouteMiddleware((context) => {
  const { pathname } = context.url;
  const currentFramework = getFrameworkFromUrl(pathname);
  const { sidebar } = context.locals.starlightRoute
  context.locals.starlightRoute.sidebar = filterSidebarByFramework(currentFramework, sidebar);
  for (const item of sidebar) {
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
