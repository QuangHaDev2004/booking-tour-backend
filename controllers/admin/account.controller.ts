import { Request, Response } from "express";
import AccountAdmin from "../../models/account-admin.model";
import bcrypt from "bcryptjs";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountAdmin.findOne({
      email: req.body.email,
    });

    if (existAccount) {
      return res.status(400).json({
        message: "Email đã tồn tại trong hệ thống!",
      });
    }

    req.body.status = "initial";

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newAccount = new AccountAdmin(req.body);
    await newAccount.save();

    res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    console.log("Lỗi đăng ký account admin", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
