import { Routes } from '@angular/router';
import { MouseTrackerComponent } from './components/mouse-tracker/mouse-tracker.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'cursor-track',component:MouseTrackerComponent},
    {path:'**',component:PageNotFoundComponent}


];
