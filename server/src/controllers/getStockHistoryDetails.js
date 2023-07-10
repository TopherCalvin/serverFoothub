const db = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const getStockHistoryDetail = {
  getHistoryDetails: async (req, res) => {
    const { shoe_id, status, warehouse, month, page } = req.query;
    page = parseInt(page) || 0;
    const limit = 5;
    const offset = limit * page;
    let where = {};

    if (month) {
      where = {
        shoe_id,
        "$stock.warehouse.name$": {
          [Op.like]: `%${warehouse}%`,
        },
        createdAt: db.sequelize.where(
          db.sequelize.fn(
            "MONTH",
            db.sequelize.col("stock_histories.createdAt")
          ),
          month
        ),
      };
    } else {
      where = {
        shoe_id,
        "$stock.warehouse.name$": {
          [Op.like]: `%${warehouse}%`,
        },
      };
    }

    let historyDetails = await db.stockHistories.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: db.stocks,
          as: "stock",
          include: [
            {
              model: db.shoes,
              as: "shoe",
            },
            {
              model: db.warehouses,
              as: "warehouse",
            },
          ],
        },
      ],
      where: where,
    });

    historyDetails.dataValues.forEach((val) => {
      //convert datetime
      val.createdAt = moment(val.createdAt).format("D MMMM YYYY HH.mm");
      // stock in and stock out
      let stock_in = 0;
      let stock_out = 0;
      let difference = historyDetails.stock_before - historyDetails.stock_after;
      if (difference < 0) {
        stock_out += Math.abs(difference);
      } else {
        stock_in += difference;
      }
    });
  },
};
module.exports = getStockHistoryDetail;
