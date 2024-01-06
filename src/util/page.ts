import { App, TAbstractFile, TFile, getAllTags } from "obsidian";
import { SuggestItem } from "src/view/suggest/Suggest";

export interface Property {
	name: string;
	sampleValue: string;
}

export function getAllProperties(query: string, app: App): Property[] {
	const propertyMapByName: Map<string, Property> = new Map();
	const queryKey = query?.toLowerCase();
	app.vault.getAllLoadedFiles().forEach((file) => {
		if (file instanceof TFile) {
			const cache = app.metadataCache.getCache(file.path);
			if (cache) {
				for (const key in cache.frontmatter) {
					if (!propertyMapByName.has(key)) {
						if (!queryKey || key.toLowerCase().includes(queryKey)) {
							const value = cache.frontmatter[key];
							propertyMapByName.set(key, {
								name: key,
								sampleValue: value,
							});
						}
					}
				}
			}
		}
	});
	return Array.from(propertyMapByName.values());
}

export function getTagOptions(inputStr: string, app: App): SuggestItem[] {
	const abstractFiles = app.vault.getAllLoadedFiles();
	const tags: string[] = [];
	const lowerCaseInputStr = inputStr.toLowerCase();
	abstractFiles.forEach((file: TAbstractFile) => {
		if (file instanceof TFile) {
			const cache = this.app.metadataCache.getCache(file.path);
			if (cache) {
				const fileTags = getAllTags(cache);
				fileTags?.forEach((tag) => {
					if (
						tag.toLowerCase().contains(lowerCaseInputStr) &&
						!tags.includes(tag)
					) {
						tags.push(tag);
					}
				});
			}
		}
	});
	return tags.map((tag) => {
		return {
			id: tag,
			label: tag,
			value: tag,
		};
	});
}
