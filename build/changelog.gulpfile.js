/* eslint-disable import/no-extraneous-dependencies */
import { readFile } from 'fs';
import { platform } from 'os';
import { each } from 'lodash';
import gulp from 'gulp';

import config from './config.gulpfile';

const { $ } = config;
const { version } = config.pkg;

const GITTAG_FILE = './tags.tmp';

const CHANGELOG_FILE = './CHANGELOG.md';

const CHANGELOG_PREFIXS = {
  BugFix: [
    '^\\[B',
    '^BUGFIX '
  ],
  Feature: [
    '^FEATURE '
  ],
  Performance: [
    '^PERF '
  ],
  Other: [
    '^WIP ',
    '^代码调整'
  ]
};

const isWindows = platform() == 'win32';

const cmds = isWindows ? [
  `echo.>>${CHANGELOG_FILE}`,
  `echo # v${version}>>${CHANGELOG_FILE}`
] : [
  `echo "\n# v${version}\n" >> ${CHANGELOG_FILE}`
];

each(CHANGELOG_PREFIXS, (prefixes, type) => {
  if (isWindows) {
    cmds.push(`echo.>>${CHANGELOG_FILE}`);
    cmds.push(`echo ## ${type}>>${CHANGELOG_FILE}`);
    cmds.push(`echo.>>${CHANGELOG_FILE}`);
  } else {
    cmds.push(`echo "## ${type}\n" >> ${CHANGELOG_FILE}`);
  }

  each(prefixes, (prefix) => {
    cmds.push(`git log --pretty=format:"* [%h] %s (@%cn)" --grep="${prefix}" \
      <%= versionPrev() %>...HEAD >> ${CHANGELOG_FILE}`);
    if (isWindows) {
      cmds.push(`echo.>>${CHANGELOG_FILE}`);
    } else {
      cmds.push(`echo "\n" >> ${CHANGELOG_FILE}`);
    }
  });
});

if (isWindows) {
  cmds.push(`echo.>>${CHANGELOG_FILE}`);
  cmds.push(`echo.>>${CHANGELOG_FILE}`);
} else {
  cmds.push(`echo "\n\n" >> ${CHANGELOG_FILE}`);
}

let versionPrev;

gulp.task('changelog:check', (done) => {
  readFile(CHANGELOG_FILE, {
    encoding: 'utf8'
  }, (err, content) => {
    if (err) {
      done(err);
      return;
    }
    if (new RegExp(`^# v${version}`).test(content)) {
      done(new Error(`Version ${version} already exists in ${CHANGELOG_FILE}`));
      return;
    }
    done();
  });
});

gulp.task(
  'changelog:git-tag-write', ['changelog:check'],
  $.shell.task(`git tag -l "v*" --sort v:refname > ${GITTAG_FILE}`)
);

gulp.task('changelog:git-tag-read', ['changelog:git-tag-write'], (done) => {
  readFile(GITTAG_FILE, {
    encoding: 'utf8'
  }, (err, content) => {
    if (err) {
      done(err);
      return;
    }
    const tags = content.split('\n');
    versionPrev = tags[tags.length - 2];
    done();
  });
});

gulp.task('changelog:git-tag-remove', ['changelog:git-tag-read'], () => $.del([
  GITTAG_FILE
]));

gulp.task(
  'changelog:git-log', ['changelog:git-tag-remove'],
  $.shell.task(cmds, {
    templateData: {
      versionPrev() {
        return versionPrev;
      }
    }
  })
);

gulp.task('changelog', ['changelog:git-log'], () =>
  gulp.src(CHANGELOG_FILE)
    .pipe($.replace(/\r\n/g, '\n'))
    .pipe($.replace(/\n{3,}/g, '\n\n'))
    .pipe(gulp.dest('./')));
