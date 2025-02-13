import MirakData from "../../src/core/entities/MirakData";

describe("MirakData class test suit", () => {
  let instance: MirakData;
  const inputData = {
    appsFound: [
      {
        type: "o",
        vendor: "redhat",
        product: "enterprise",
        version: "9.5",
        cpeName: "cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*",
      },
    ],
    redeExternal: {
      hostIP: "172.17.0.2",
      openPorts: [43771, 8323, 3323],
      portsUseBy: {
        43771: "node",
        8323: "routinator",
        3323: "routinator",
      },
    },
  };
  beforeAll(() => {
    instance = MirakData.instance;
  });
  afterEach(() => {
    instance.clearData();
  });
  describe("osData", () => {
    it("should return a Software data with the os type", () => {
      instance.mirakFile = inputData;
      const result = instance.osData;
      expect(result.type).toEqual("o");
    });
    it("should return an error because the data is not loaded before use",()=>{
        try {
            const result = instance.osData;
            result.version = "1.0.0";
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
  });
  describe("allAppsFound",()=>{
    it("should return an array containing data from different software",()=>{
        inputData.appsFound.push({
            type: "a",
            vendor: "test1",
            product: "test1",
            version: "1.0.1",
            cpeName: "cpe:2.3:test1:test1:1.0.1:*:*:*:*:*:*:*"
        })
        instance.mirakFile = inputData;
        const apps = instance.allAppsFound;
        expect(apps).toHaveLength(2);
    });

    it("should return an error because the data is not loaded before use",()=>{
        try {
            const result = instance.allAppsFound;
            result[0].version = '1.0.1';
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
    it("should return an error when an array is not found",()=>{
        try {
            const inputDataWithNoCPE = {
                appsFound: undefined,
                redeExternal: {
                  hostIP: "172.17.0.2",
                  openPorts: [43771, 8323, 3323],
                  portsUseBy: {
                    43771: "node",
                    8323: "routinator",
                    3323: "routinator",
                  },
                },
              };
            instance.mirakFile = inputDataWithNoCPE;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.allAppsFound;

            
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
    it("should return an error when a software present in the array has one or more properties missing",()=>{
        try {
            const inputDataWithNoCPE = {
                appsFound: [
                  {
                    type: "o",
                    vendor: "redhat",
                    product: "enterprise",
                    version: "9.5",
                  },
                ],
                redeExternal: {
                  hostIP: "172.17.0.2",
                  openPorts: [43771, 8323, 3323],
                  portsUseBy: {
                    43771: "node",
                    8323: "routinator",
                    3323: "routinator",
                  },
                },
              };
            instance.mirakFile = inputDataWithNoCPE;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.allAppsFound;
          
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe('The "appsFound" has software with invalid property, the software at position 1 in MirakFile may be corrupted');
        }
    });
  });
  describe("hostIp",()=>{
    it("should return an ip with value '172.17.0.2'",()=>{
        instance.mirakFile = inputData;
        expect(instance.hostIp).toBe("172.17.0.2");
    });
    it("should return an error because the data is not loaded before use",()=>{
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.hostIp;
            
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
  });

  describe("openPorts",()=>{
    it("should return an array with ports numbers",()=>{
        instance.mirakFile =inputData;
        expect(instance.openPorts).toContain(3323);
    });
    it("should return an error because the data is not loaded before use",()=>{
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.openPorts;
            
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
  });
  describe("portsUseBySoftware", ()=>{
    it("should return a data record with port numbers as keys and product name as value",()=>{
        instance.mirakFile =inputData;
        const record = instance.portsUseBySoftware;
        expect(Object.keys((record as Record<number, string>))).toContain("3323");
        expect(record).toBeDefined();
        expect((record as Record<number, string>)[3323]).toEqual("routinator");
    });
    it("should return an error because the data is not loaded before use",()=>{
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.openPorts;
            
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
});

describe("searchesPortsForRelatedSoftware",()=>{
    it("should return an array with numbers of ports related with software name",()=>{
        instance.mirakFile = inputData;
        expect(instance.searchesPortsForRelatedSoftware("routinator")).toEqual([3323, 8323]);
    });
    it("should return an empty array because an invalid software name was passed",()=>{
        instance.mirakFile = inputData;
        expect(instance.searchesPortsForRelatedSoftware("curl")).toEqual([]);
    });
    it("should return an error because the data is not loaded before use",()=>{
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.openPorts;
            
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
  });

  describe("softwareSearchByVendorAndProduct",()=>{
    it("must return software with vendor and product compatible with the query values ",()=>{
        instance.mirakFile = inputData;
        const software = instance.softwareSearchByVendorAndProduct("redhat", "enterprise");
        expect(software?.vendor).toEqual("redhat");
        expect(software?.product).toEqual("enterprise");
        expect(software?.type).toEqual("o");
    });
    it("should return an null value because an invalid vendor and product was passed",()=>{
        instance.mirakFile = inputData;
        const software = instance.softwareSearchByVendorAndProduct("canonical", "ubuntu_linux");
        expect(software).toBeNull();
    });
    it("should return an error because the data is not loaded before use",()=>{
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = instance.softwareSearchByVendorAndProduct("redhat", "enterprise");
            
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe("Mirak file was not previously loaded");
        }
    });
  });

});
