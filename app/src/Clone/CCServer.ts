/*
    cpbooster "Competitive Programming Booster"
    Copyright (C) 2020  Sergio G. Sanchez V.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import chalk from "chalk";
import { spawn, spawnSync } from "child_process";
import express from "express";
import * as fs from "fs";
import * as Path from "path";
import { exit } from "process";
import Config from "../Config/Config";
import SourceFileCreator from "../Create/SourceFileCreator";
import Tester from "../Test/TesterFactory/Tester";
import ProblemData from "../Types/ProblemData";
import Util from "../Utils/Util";
import { getEditorCommand } from "./EditorCommandBuilder";

/* Competitive Companion Server */
export default class CCServer {
  app = express();
  contestName = "NO_NAME";
  contestPath = "";
  platform = "NO_PLATFORM";
  config: Config;
  isActive = false;
  lastRequestTime = process.hrtime();
  constructor(config: Config) {
    this.config = config;
    this.app.use(express.json());
    this.app.post("/", (request, response) => {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("OK");

      const problemData: ProblemData = request.body;
      problemData.name = Util.normalizeFileName(problemData.name);
      problemData.group = Util.normalizeFileName(problemData.group);
      if (this.config.createContestPlatformDirectory) {
        const [platform, contestName] = problemData.group.split("-").map((str) => str.trim());
        this.platform = platform;
        // removes platform name from contest name
        let cleanedContestName = contestName.replace(new RegExp(this.platform, "g"), "");
        cleanedContestName = Util.normalizeFileName(cleanedContestName);
        // removes extra dots
        this.contestName = cleanedContestName.replace(/\./g, "");
      } else {
        problemData.group = Util.normalizeFileName(problemData.group);
        this.contestName = problemData.group;
      }

      const contestPath = config.cloneInCurrentDir
        ? this.contestName
        : this.config.createContestPlatformDirectory
        ? Path.join(this.config.contestsDirectory, this.platform, this.contestName)
        : Path.join(this.config.contestsDirectory, problemData.group);
      if (!fs.existsSync(contestPath)) fs.mkdirSync(contestPath, { recursive: true });
      this.contestPath = contestPath;
      const FilesPathNoExtension = `${Path.join(contestPath, problemData.name)}`;
      const extension = `.${config.preferredLang}`;
      const filePath = `${FilesPathNoExtension}${extension}`;
      SourceFileCreator.create(filePath, config, false, problemData.timeLimit, problemData.url);
      problemData.tests.forEach((testcase, idx) => {
        fs.writeFileSync(Tester.getInputPath(filePath, idx + 1), testcase.input);
        fs.writeFileSync(Tester.getAnswerPath(filePath, idx + 1), testcase.output);
      });
      const tcLen = problemData.tests.length;
      console.log(`-> ${problemData.tests.length} Testcase${tcLen == 1 ? "" : "s"}`);
      console.log("-------------");

      // Copy debug file if enabled
      this.copyDebugFileIfEnabled(contestPath);

      if (!this.isActive) this.isActive = true;
      this.lastRequestTime = process.hrtime();
    });
  }

  private copyDebugFileIfEnabled(contestPath: string): void {
    if (!this.config.copyDebugFile) return;

    const debugFilePath = this.config.debugFilePath;
    if (!fs.existsSync(debugFilePath)) {
      console.log(chalk.yellow(`Debug file not found at: ${debugFilePath}`));
      return;
    }

    const targetPath = Path.join(contestPath, Path.basename(debugFilePath));
    try {
      fs.copyFileSync(debugFilePath, targetPath);
      console.log(`Debug file copied: ${Path.basename(debugFilePath)}`);
    } catch (error) {
      console.log(chalk.red(`Failed to copy debug file: ${error}`));
    }
  }

  run(): void {
    if (!this.config.preferredLang) {
      console.log("Missing preferred language (preferredLang) key in configuration");
      exit(0);
    }
    const serverRef = this.app.listen(this.config.port, () => {
      console.info("\nserver running at port:", this.config.port);
      console.info('\nserver waiting for "Competitive Companion Plugin" to send problems...\n');
    });

    const interval = setInterval(() => {
      if (!this.isActive) return;
      const elapsedTime = process.hrtime(this.lastRequestTime)[0];
      const tolerance = Util.isWindows() ? 4 : 1;
      if (elapsedTime >= tolerance) {
        if (serverRef) serverRef.close();
        clearInterval(interval);
        console.log("\n\t    DONE!\n");
        console.log(`The path to your contest folder is: "${this.contestPath}"`);
        console.log("\n\tHappy Coding!\n");
        const command = getEditorCommand(this.config.editor, this.contestPath);
        if (command) {
          const newTerminalExec = spawn(command, { shell: true, detached: true, stdio: "ignore" });
          newTerminalExec.unref();
          if (this.config.closeAfterClone && !Util.isWindows()) {
            const execution = spawnSync("ps", ["-o", "ppid=", "-p", `${process.ppid}`]);
            const grandParentPid = parseInt(execution.stdout.toString().trim());
            if (!Number.isNaN(grandParentPid)) {
              process.kill(grandParentPid, "SIGKILL");
            }
          }
        } else {
          console.log(
            chalk.yellow(
              "The terminal specified in the configuration " +
                "file is not fully supported yet, you will have to change your directory manually\n"
            )
          );
        }
        exit(0);
      }
    }, 100);
  }
}
