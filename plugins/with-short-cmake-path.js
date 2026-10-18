const { withAppBuildGradle } = require('expo/config-plugins');

const cmakeStagingSetting =
  'buildStagingDirectory new File(gradle.gradleUserHomeDir, "cxx/${rootProject.name}/app")';

const cmakeStagingBlock = `    externalNativeBuild {
        cmake {
            // Keep generated C++ object paths below Ninja's Windows path limit.
            ${cmakeStagingSetting}
        }
    }
`;

module.exports = function withShortCmakePath(config) {
  return withAppBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error('with-short-cmake-path only supports Groovy build.gradle files.');
    }

    const { contents } = gradleConfig.modResults;
    if (contents.includes(cmakeStagingSetting)) {
      return gradleConfig;
    }

    const androidBlock = /android\s*\{\r?\n/;
    if (!androidBlock.test(contents)) {
      throw new Error('Could not find the Android configuration block in app/build.gradle.');
    }

    gradleConfig.modResults.contents = contents.replace(
      androidBlock,
      (match) => `${match}${cmakeStagingBlock}`,
    );

    return gradleConfig;
  });
};
