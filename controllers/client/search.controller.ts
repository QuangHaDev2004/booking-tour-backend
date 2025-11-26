import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import City from "../../models/city.model";
import moment from "moment";
import slugify from "slugify";

export const list = async (req: Request, res: Response) => {
  try {
    const find: any = {
      deleted: false,
      status: "active",
    };

    // keyword
    if (req.query.keyword) {
      const keyword = slugify(req.query.keyword as string);
      const keywordRegex = new RegExp(keyword, "i");
      find.slug = keywordRegex;
    }

    // price
    if (req.query.price) {
      const [priceMin, priceMax] = (req.query.price as string)
        .split("-")
        .map((item: string) => parseInt(item));

      find.priceNewAdult = {
        $gte: priceMin,
        $lte: priceMax,
      };
    }

    // locationFrom
    if (req.query.locationFrom) {
      find.locationsFrom = { $in: req.query.locationFrom };
    }

    // locationTo
    if (req.query.locationTo) {
      find.locationsTo = { $in: req.query.locationTo };
    }

    // departureDate
    if (req.query.departureDate) {
      const date = new Date(req.query.departureDate as string);
      find.departureDate = date;
    }

    const tourList = await Tour.find(find).sort({
      position: "desc",
    });

    const dataFinal = [];
    for (const item of tourList) {
      const itemFinal = {
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        time: item.time,
        slug: item.slug,
        priceNewAdult: item.priceNewAdult,
        locationsFromName: [],
        departureDateFormat: "",
        discount: 0,
      };

      if (item.priceAdult && item.priceNewAdult) {
        itemFinal.discount = Math.floor(
          ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
        );
      }

      if (item.locationsFrom.length > 0) {
        itemFinal.locationsFromName = await City.find({
          _id: { $in: item.locationsFrom },
        });
      }

      if (item.departureDate) {
        itemFinal.departureDateFormat = moment(item.departureDate).format(
          "DD/MM/YYYY"
        );
      }

      dataFinal.push(itemFinal);
    }

    // console.log(tourList);

    res.status(200).json({
      message: "Kết quả tìm kiếm!",
      tourList: dataFinal,
    });
  } catch (error) {
    console.log("Lỗi khi gọi list", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
