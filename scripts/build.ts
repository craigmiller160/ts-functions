import spawn  from 'cross-spawn';
import { SpawnSyncReturns } from 'child_process';
import path from 'path';
import fs from 'fs';

interface PackageJson {
    scripts: {
        prepare?: string;
    }
}

const FP_TS_REGEX = /^(?<importName>.*)'fp-ts\/(?<fileName>.*)';$/

interface FpTsGroups {
    readonly importName: string;
    readonly fileName: string;
}

const clean = () => {
    fs.rmSync(path.join(process.cwd(), 'lib'), {
        recursive: true,
        force: true
    });
};

const build = (): SpawnSyncReturns<Buffer> => {
    console.log('Building commonjs code');
    return spawn.sync('tsc', {
        stdio: 'inherit'
    });
};

const buildES = (): SpawnSyncReturns<Buffer> => {
    console.log('Building esmodule code');
    return spawn.sync('tsc', ['-p', 'tsconfig.esmodule.json'], {
        stdio: 'inherit'
    });
};

const fixEsImports = () => {
    console.log('Fixing ES Imports');
    const esOutput = path.join(process.cwd(), 'lib', 'es');
    const files = fs.readdirSync(esOutput);
    files.forEach((file) => {
        const fullFilePath = path.join(esOutput, file);
        const text = fs.readFileSync(fullFilePath, 'utf8');
        const newText = text.split('\n')
            .map((line) => {
                if (FP_TS_REGEX.test(line)) {
                    const groups = FP_TS_REGEX.exec(line)?.groups as unknown as FpTsGroups;
                    return `${groups.importName}'fp-ts/es6/${groups.fileName}';`;
                }
                return line;
            })
            .join('\n');
        fs.writeFileSync(fullFilePath, newText);
    });
};

const copyPackageJson = () => {
    const packageJsonTxt = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageJsonTxt) as PackageJson;
    delete packageJson.scripts.prepare;
    fs.writeFileSync(path.join(process.cwd(), 'lib', 'package.json'), JSON.stringify(packageJson, null, 2));
};

const failIfError = (fn: () => SpawnSyncReturns<Buffer>) => {
    const result = fn();
    if (result.status !== 0) {
        process.exit(result.status!);
    }
}

clean();
failIfError(build);
failIfError(buildES);
fixEsImports();
copyPackageJson();