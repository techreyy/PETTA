import * as migration_20261003_090000_team_roster from './20261003_090000_team_roster';
import * as migration_20260927_084155_initial_cms from './20260927_084155_initial_cms';
import * as migration_20260927_090000_contact_limits from './20260927_090000_contact_limits';
import * as migration_20260927_090057_team from './20260927_090057_team';
import * as migration_20260927_094500_awards_competitions from './20260927_094500_awards_competitions';
import * as migration_20260929_161232_brand_logos from './20260929_161232_brand_logos';
import * as migration_20260930_183907_services from './20260930_183907_services';
import * as migration_20261002_133000_seed_project_folder from './20261002_133000_seed_project_folder';
import * as migration_20261003_100000_media_object_key from './20261003_100000_media_object_key';
import * as migration_20261004_100000_homepage_content from './20261004_100000_homepage_content';

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
    name: '20260927_090057_team',
  },
  {
    up: migration_20260927_094500_awards_competitions.up,
    down: migration_20260927_094500_awards_competitions.down,
    name: '20260927_094500_awards_competitions',
  },
  {
    up: migration_20260929_161232_brand_logos.up,
    down: migration_20260929_161232_brand_logos.down,
    name: '20260929_161232_brand_logos',
  },
  {
    up: migration_20260930_183907_services.up,
    down: migration_20260930_183907_services.down,
    name: '20260930_183907_services'
  },
  {
    up: migration_20261002_133000_seed_project_folder.up,
    down: migration_20261002_133000_seed_project_folder.down,
    name: '20261002_133000_seed_project_folder'
  },
  { up: migration_20261003_090000_team_roster.up, down: migration_20261003_090000_team_roster.down, name: '20261003_090000_team_roster' },
  { up: migration_20261003_100000_media_object_key.up, down: migration_20261003_100000_media_object_key.down, name: '20261003_100000_media_object_key' },
  { up: migration_20261004_100000_homepage_content.up, down: migration_20261004_100000_homepage_content.down, name: '20261004_100000_homepage_content' },
];
