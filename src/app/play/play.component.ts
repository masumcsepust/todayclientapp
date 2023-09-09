import { Component, OnInit } from '@angular/core';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  message: string | undefined;

  constructor(private playService: PlayService) {}

  ngOnInit() {
    this.playService.getPlayer().subscribe((res: any) => {
      this.message = res.value.message
    }, err => {
      console.log(err);
    })
  }
}
