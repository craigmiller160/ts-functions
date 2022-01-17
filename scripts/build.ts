import spawn from 'cross-spawn';

// TODO add validation to this

const build = () => spawn.sync('tsc', {
    stdio: 'inherit'
});

const copyFiles = () => {
    spawn.sync('cp', ['package.json', 'lib'], {
        cwd: process.cwd(),
        stdio: 'inherit'
    });
};

build();