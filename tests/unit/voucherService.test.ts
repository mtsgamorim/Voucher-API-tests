import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";
import prisma from "../../src/config/database";
import { conflictError } from "../../src/utils/errorUtils";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE vouchers`;
});

afterAll(() => {
  prisma.$disconnect;
});

describe("Testes em createVoucher", () => {
  it("Caso sucesso", async () => {
    const code = "dsdsd32234";
    const discount = 10;
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(null);
    jest.spyOn(voucherRepository, "createVoucher").mockResolvedValueOnce({
      id: 1,
      code: code,
      discount: discount,
      used: false,
    });
    try {
      await voucherService.createVoucher(code, discount);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  it("Caso erro, ja existe um com esse mesmo codigo", async () => {
    const discount = 10;
    const code = "sadsadasdasdsad";
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({
      id: 1,
      code: code,
      discount: discount,
      used: false,
    });

    try {
      await voucherService.createVoucher(code, discount);
    } catch (error) {
      expect(error).toEqual(conflictError("Voucher already exist."));
    }
  });
});
