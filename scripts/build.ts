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

const validate = (): SpawnSyncReturns<Buffer> => {
    console.log('Validating project');
    return spawn.sync('yarn', ['validate'], {
        stdio: 'inherit'
    });
}

const build = (): SpawnSyncReturns<Buffer> => {
    console.log('Building project');
    return spawn.sync('tsc', {
        stdio: 'inherit'
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

failIfError(validate);
failIfError(build);
copyPackageJson();