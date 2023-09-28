import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../shared/guards/admin.guard';
import { AddEditMemberComponent } from './add-edit-member/add-edit-member.component';

const routes: Routes = [
  { path: '',
  runGuardsAndResolvers: 'always',
  canActivate: [AdminGuard],
    children:  [
      { path:'', component: AdminComponent},
      { path:'add-edit-member', component: AddEditMemberComponent},
      { path:'admin-edit-member/:id', component: AddEditMemberComponent},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
