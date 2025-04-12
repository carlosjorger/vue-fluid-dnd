import { FRAMEWORKS_TYPES } from "@/types";

export const getFrameworkFromUrl = (url: string)=>{
    const frameworks = Object.values(FRAMEWORKS_TYPES);
    for (const framework of frameworks) {
        if (url.includes(framework)) {
            return framework
        }
    }
    return FRAMEWORKS_TYPES.vue;
}