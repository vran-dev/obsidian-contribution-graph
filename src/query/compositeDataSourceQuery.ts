import { GraphProcessError } from "src/processor/graphProcessError";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { DataSource } from "./types";
import { App } from "obsidian";
import { DataviewPageDataSourceQuery } from "./dataviewPageDataSourceQuery";
import { DataviewTaskDataSourceQuery } from "./dataviewTaskDataSourceQuery";

export class CompositeDataSourceQuery {

    private dataSourceQueries: BaseDataviewDataSourceQuery[] = [
        new DataviewPageDataSourceQuery(),
        new DataviewTaskDataSourceQuery(),
    ];

    query(source: DataSource, app: App) {
        const dataSourceQuery = this.dataSourceQueries.find(query => query.accept(source));
        if (!dataSourceQuery) {
            throw new GraphProcessError({
                summary: "Unsupported data source",
                recommends: [
                    "Please use supported data source",
                ]
            });
        }
        return dataSourceQuery.query(source, app);
    }
}