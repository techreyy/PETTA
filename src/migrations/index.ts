import * as migration_20260927_084155_initial_cms from './20260927_084155_initial_cms';
import * as migration_20260927_090000_contact_limits from './20260927_090000_contact_limits';
import * as migration_20260927_090057_team from './20260927_090057_team';
import * as migration_20260927_094500_awards_competitions from './20260927_094500_awards_competitions';

export const migrations = [
  {
    up: migration_20260927_084155_initial_cms.up,
    down: migration_20260927_084155_initial_cms.down,
    name: '20260927_084155_initial_cms',
  },
  {
    up: migration_20260927_090000_contact_limits.up,
    down: migration_20260927_090000_contact_limits.down,
    name: '20260927_090000_contact_limits',
  },
  {
    up: migration_20260927_090057_team.up,
    down: migration_20260927_090057_team.down,
    name: '20260927_090057_team'
  },
  {
    up: migration_20260927_094500_awards_competitions.up,
    down: migration_20260927_094500_awards_competitions.down,
    name: '20260927_094500_awards_competitions'
  },
];
