import type { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { List } from './components/movies/list/list';
import { MovieDetails } from './components/movies/movie-details/movie-details';
import { PeopleList } from './components/people/list/list';
import { PersonDetails } from './components/people/person-details/person-details';
import { SpeciesList } from './components/species/list/list';
import { SpeciesDetails } from './components/species/species-details/species-details';
import { LocationsList } from './components/locations/list/list';
import { LocationDetails } from './components/locations/location-details/location-details';
import { VehiclesList } from './components/vehicles/list/list';
import { VehicleDetails } from './components/vehicles/vehicle-details/vehicle-details';

export const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' },
 { path: 'home', component: Home },
 { path: 'movies', component: List },
 { path: 'list', component: List },
 { path: 'movie/:id', component: MovieDetails },
 { path: 'people', component: PeopleList },
 { path: 'people/:id', component: PersonDetails },
 { path: 'species', component: SpeciesList },
 { path: 'species/:id', component: SpeciesDetails },
 { path: 'locations', component: LocationsList },
 { path: 'locations/:id', component: LocationDetails },
 { path: 'vehicles', component: VehiclesList },
 { path: 'vehicles/:id', component: VehicleDetails }
];