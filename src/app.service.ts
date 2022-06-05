import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { response } from 'express';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getData(params) {
    return lastValueFrom(
      await this.httpService
        .get(`https://hacker-news.firebaseio.com/v0/${params.HNLINK}`)
        .pipe(map((response) => response.data)),
    );
  }
}
