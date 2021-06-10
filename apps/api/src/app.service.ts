import { Injectable } from "@nestjs/common";

const enpointsList = [
  { v1: ["/collections/:id/", "/collection/:id/images?page=:page&limit=:limit", "/stats", "/users/:userId/collections"] },
];

@Injectable()
export class AppService {
  getHello(): {} {
    return enpointsList;
  }
}
