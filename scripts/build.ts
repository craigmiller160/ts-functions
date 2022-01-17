import spawn from 'cross-spawn';
import path from 'path';
import fs from 'fs';

// TODO add validation to this

interface PackageJson {
    scripts: {
        prepare?: string;
    }
}

const build = () => spawn.sync('tsc', {
    stdio: 'inherit'
});

const copyPackageJson = () => {
    const packageJsonTxt = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageJsonTxt) as PackageJson;
    delete packageJson.scripts.prepare;
    fs.writeFileSync(path.join(process.cwd(), 'lib', 'package.json'), JSON.stringify(packageJson, null, 2));
};

build();
copyPackageJson();