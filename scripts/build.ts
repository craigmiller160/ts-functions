import spawn from 'cross-spawn';

// TODO add validation to this

const build = () => spawn.sync('tsc', {
    stdio: 'inherit'
});

build();