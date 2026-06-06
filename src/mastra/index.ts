import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from "@mastra/core/storage";
import "dotenv/config";

import {
  Observability,
  MastraStorageExporter,
  MastraPlatformExporter,
  SensitiveDataFilter,
} from "@mastra/observability";

import { financeAgent } from "./agents/finance-agent.js";

export const mastra = new Mastra({
  agents: {
    financeAgent,
  },

  storage: new MastraCompositeStore({
    id: "composite-storage",

    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db",
    }),

    domains: {
      observability: await new DuckDBStore().getStore(
        "observability"
      ),
    },
  }),

  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),

  observability: new Observability({
    configs: {
      default: {
        serviceName: "finance-agent",

        exporters: [
          new MastraStorageExporter(),
          new MastraPlatformExporter(),
        ],

        spanOutputProcessors: [
          new SensitiveDataFilter(),
        ],
      },
    },
  }),
});