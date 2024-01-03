import { App, TFile } from "obsidian";

export interface Property {
    name: string,
    sampleValue: string
}

export function getAllProperties(query: string, app: App): Property[] {
    const propertyMapByName: Map<string, Property> = new Map();
    const queryKey = query?.toLowerCase();
    app.vault.getAllLoadedFiles().forEach(file => {
        if (file instanceof TFile) {
            const cache = app.metadataCache.getCache(file.path);
            if (cache) {
                for (const key in cache.frontmatter) {
                    if (!propertyMapByName.has(key)) {
                        if (!queryKey || key.toLowerCase().includes(queryKey)) {
                            const value = cache.frontmatter[key];
                            propertyMapByName.set(key, { name: key, sampleValue: value });
                        }
                    }
                }
            }
        }
    })
    return Array.from(propertyMapByName.values())
}