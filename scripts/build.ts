import spawn  from 'cross-spawn';
import { SpawnSyncReturns } from 'child_process';
import path from 'path';
import fs from 'fs';

// TODO add validation to this

interface PackageJson {
    scripts: {
        prepare?: string;
    }
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
}

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
copyPackageJson();