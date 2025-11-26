import { Request, Response } from "express";
import Category from "../../models/category.model";
import * as categoryHelper from "../../helpers/category.helper";
import Tour from "../../models/tour.model";
import City from "../../models/city.model";
import moment from "moment";

export const list = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const categoryDetail = await Category.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (!categoryDetail) {
      return res.status(404).json({ message: "Danh mục không tồn tại!" });
    }

    // Breadcrumb
    const breadcrumb = [];

    if (categoryDetail.parent) {
      const categoryParent = await Category.findOne({
        _id: categoryDetail.parent,
        deleted: false,
        status: "active",
      });

      if (categoryParent) {
        breadcrumb.push({
          id: categoryParent.id,
          name: categoryParent.name,
          slug: categoryParent.slug,
          avatar: categoryParent.avatar,
        });
      }
    }

    breadcrumb.push({
      id: categoryDetail.id,
      name: categoryDetail.name,
      slug: categoryDetail.slug,
      avatar: categoryDetail.avatar,
    });

    // Category Detail
    const categoryFinal = {
      name: categoryDetail.name,
      description: categoryDetail.description,
    };

    // Tour List by Category
    const categoryId = categoryDetail.id;
    const categoryChild = await categoryHelper.getCategoryChild(categoryId);
    const categoryChildId = categoryChild.map((item: any) => item.id);

    const tourList = await Tour.find({
      category: {
        $in: [categoryId, ...categoryChildId],
      },
      deleted: false,
      status: "active",
    }).sort({
      position: "desc",
    });

    const tourListFinal = [];
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

      tourListFinal.push(itemFinal);
    }

    res.status(200).json({
      message: "Danh sách tour theo danh mục!",
      breadcrumb,
      categoryDetail: categoryFinal,
      tourList: tourListFinal,
    });
  } catch (error) {
    console.log("Lỗi khi gọi list", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
