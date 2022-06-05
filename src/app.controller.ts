import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { map, observable } from 'rxjs';

@Controller()
export class AppController {
  private data = {
    titlemost25: {
      HNLINK: '',
      titles: [],
      stories: [],
    },
    titleMost23Week: {},
    titlemost600: {},
  };
  constructor(private readonly appService: AppService) {}

  sortCounter(mostTitles) {
    let wordCounts = {};
    let words = mostTitles.split(/\s/);
    for (let i = 0; i < words.length; i++)
      wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;
    let items = Object.keys(wordCounts).map((key) => {
      return [key, wordCounts[key]];
    });

    items.sort((first, second) => {
      return second[1] - first[1];
    });

    return items.slice(0, 10);
  }

  @Get(':param')
  async getHello(@Param() params) {
    let titles = 0;
    let stories = 0;
    let mostRecent = [];
    let mostTitles = '';
    let wordCounts = {};
    let mostUsers = [];
    let finalData = [];

    if (params.param == 'titlemost25') {
      params.HNLINK = 'newstories.json?print=pretty';
      await this.appService.getData(params).then(function (this, results) {
        while (titles <= 25) {
          mostRecent.push(results[titles]);
          titles++;
        }
      });

      while (stories <= 25) {
        params.HNLINK = 'item/' + mostRecent[stories] + '.json?print=pretty';
        await this.appService.getData(params).then(function (this, results) {
          mostTitles += results.title + ' ';
        });

        stories++;
      }

      mostTitles.toLowerCase();
      mostTitles.replace(/[^0-9a-z ]/g, '');
      const finalResults = this.sortCounter(mostTitles);

      console.log(finalResults);
      return finalResults;

    }

    else if (params.param == 'topusers') {
      params.HNLINK = 'newstories.json?print=pretty';
      await this.appService.getData(params).then(function (this, results) {
        mostUsers.push(results);
      });

      for (let i = 0; i <= 25; i++) {
        params.HNLINK = 'item/' + mostUsers[0][i] + '.json?print=pretty';
        await this.appService.getData(params).then(function (this, results) {
          mostUsers[0][i] = {
            title: results.title,
            byUser: results.by,
            storyID: results.id,
          };
        });
      }

      for (let x = 0; x <= 25; x++) {
        params.HNLINK = 'user/' + mostUsers[0][x]['byUser'] + '.json?print=pretty';
        await this.appService.getData(params).then(function (this, results) {
          if (results.karma >= 10000) {
            mostTitles += mostUsers[0][x]['title'] + ' ';
          }
        });
      }

      mostTitles.toLowerCase();
      mostTitles.replace(/[^0-9a-z ]/g, '');
      const finalResults = this.sortCounter(mostTitles);

      console.log(finalResults);
      return finalResults;
    }
    else if (params.param == 'toplastweek') {
      params.HNLINK = 'newstories.json?print=pretty';
      await this.appService.getData(params).then(function (this, results) {
        mostUsers.push(results);
      });

      const timeNow = new Date();
      const lastWeek = new Date(
        timeNow.getFullYear(),
        timeNow.getMonth(),
        timeNow.getDate() - 7,
      );
      console.log(lastWeek.toDateString());
      for (let i = 0; i <= 25; i++) {
        params.HNLINK = 'item/' + mostUsers[0][i] + '.json?print=pretty';
        await this.appService.getData(params).then(function (this, results) {
          const timeStamp = new Date(results.time * 1000);
          if (lastWeek.toDateString() !== timeStamp.toDateString()) {
            mostTitles += results.title + ' ';
          }
        });
      }

      mostTitles.toLowerCase();
      mostTitles.replace(/[^0-9a-z ]/g, '');
      const finalResults = this.sortCounter(mostTitles);

      console.log(finalResults);
      return finalResults;

    }
  }
}
