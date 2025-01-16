import Scenarios from "../../src/core/entities/Scenarios";
import { Configuration } from "../../src/core/entities/types/Scenarios";

describe("Scenarios class test suit", () => {
  let instance: Scenarios | null;
  const block1: Configuration = {
    nodes: [
      {
        operator: "OR",
        negate: false,
        cpeMatch: [
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:4.4:*:*:*:*:*:*:*",
          },
        ],
      },
    ],
  };

  const block2: Configuration = {
    nodes: [
      {
        operator: "OR",
        negate: false,
        cpeMatch: [
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:*:*:*:*:*:*:*:*",
            versionEndIncluding: "5.0",
           
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:beta1:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:beta2:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch1:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch10:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch11:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch2:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch3:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch4:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch5:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch6:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch7:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch8:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:patch9:*:*:*:*:*:*",
          },
          {
            vulnerable: true,
            criteria: "cpe:2.3:a:gnu:bash:5.0:rc1:*:*:*:*:*:*",
          },
        ],
      },
    ],
  };

  beforeAll(() => {
    instance = new Scenarios(
      "cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*"
    );
  });

  afterAll(() => {
    instance = null;
  });
  describe("isCpeVulnerable", () => {
    it("should return true for vulnerable software in this context", () => {
      const result = instance?.isCpeVulnerable(
        "cpe:2.3:a:gnu:bash:4.4:*:*:*:*:*:*:*",
        block1
      );
      expect(result).toBe(true);
    });
    it("should return false for vulnerable software in this context", () => {
      const result = instance?.isCpeVulnerable(
        "cpe:2.3:a:gnu:bash:5.1.8:*:*:*:*:*:*:*",
        block2
      );
      expect(result).toBe(false);
    });
    it("should return an error because the CPE string is invalid",()=>{
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance?.isCpeVulnerable("cpe:2.:a:bash:5.1.8:*:*:*:*:*:*:*",block2);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toEqual("The CPE string is not valid!");
        }
    });
  });
  describe("extractVersionProduct",()=>{
    it("must return an array with numeric values of the version, this one having only numbers", ()=>{
        const result = instance?.extractVersionProduct("cpe:2.3:a:gnu:bash:5.1.8:*:*:*:*:*:*:*");
        expect(result).toStrictEqual([5,1,8]);
    });
    it("must return an array with numeric values of the version, this one having numbers and caracters", ()=>{
        const result = instance?.extractVersionProduct("cpe:2.3:a:gnu:bash:5.1.8-fire1:*:*:*:*:*:*:*");
        expect(result).toStrictEqual([5,1,9]);
    });
    it("should return an array with the possible greater value", ()=>{
        const result = instance?.extractVersionProduct("cpe:2.3:a:gnu:bash:*:*:*:*:*:*:*:*");
        expect(result).toStrictEqual([Number.MAX_SAFE_INTEGER]);
    });
});
});
