import { CpeDictionaryList } from "../../src/core/entities/CPEDictionaryList";

describe("CpeDictionaryList class test suit", () => {
  let instance: CpeDictionaryList | null;
  const inputData = [
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.28.1:*:*:*:*:*:*:*",
        cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
        lastModified: "2013-05-08T14:49:12.543",
        created: "2013-04-30T15:34:26.540",
        titles: [
          {
            title: "Haxx Curl 7.28.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.28.0:*:*:*:*:*:*:*",
        cpeNameId: "19A248F4-4F2F-4664-9BAF-81FAFC21A294",
        lastModified: "2013-05-08T14:49:12.480",
        created: "2013-04-30T15:34:26.603",
        titles: [
          {
            title: "Haxx Curl 7.28.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.27.0:*:*:*:*:*:*:*",
        cpeNameId: "69A87713-B237-443C-94C6-AA81911AB36D",
        lastModified: "2013-05-08T14:49:12.423",
        created: "2013-04-30T15:34:26.660",
        titles: [
          {
            title: "Haxx Curl 7.27.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.26.0:*:*:*:*:*:*:*",
        cpeNameId: "4EAD75EB-AC5A-4545-8EAF-B7F012ECD23B",
        lastModified: "2013-05-08T14:49:12.380",
        created: "2013-04-30T15:34:26.727",
        titles: [
          {
            title: "Haxx Curl 7.26.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.25.0:*:*:*:*:*:*:*",
        cpeNameId: "6F55A9BD-8B83-4426-8FBB-337F65110870",
        lastModified: "2013-05-08T14:49:12.340",
        created: "2013-04-30T15:34:26.817",
        titles: [
          {
            title: "Haxx Curl 7.25.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.24.0:*:*:*:*:*:*:*",
        cpeNameId: "7CAD429E-D37D-4BAE-8404-B33D050C691B",
        lastModified: "2013-05-08T14:49:12.297",
        created: "2013-04-30T15:34:26.920",
        titles: [
          {
            title: "Haxx Curl 7.24.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.23.1:*:*:*:*:*:*:*",
        cpeNameId: "8F6835AD-08B8-40E4-9853-4B928C6C7041",
        lastModified: "2013-05-08T14:49:12.253",
        created: "2013-04-30T15:34:26.980",
        titles: [
          {
            title: "Haxx Curl 7.23.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.23.0:*:*:*:*:*:*:*",
        cpeNameId: "7DD54E9B-513B-4870-A24F-0072872FBBFC",
        lastModified: "2013-05-08T14:49:12.207",
        created: "2013-04-30T15:34:27.077",
        titles: [
          {
            title: "Haxx Curl 7.23.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.22.0:*:*:*:*:*:*:*",
        cpeNameId: "9C783E63-4C93-4A4D-9DF9-CED3D1AA26E5",
        lastModified: "2013-05-08T14:49:12.167",
        created: "2013-04-30T15:34:27.203",
        titles: [
          {
            title: "Haxx Curl 7.22.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.7:*:*:*:*:*:*:*",
        cpeNameId: "D8ABE6BE-EE43-4E32-8E49-D5CBC67660E3",
        lastModified: "2013-05-08T14:49:12.123",
        created: "2013-04-30T15:34:27.317",
        titles: [
          {
            title: "Haxx Curl 7.21.7",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.6:*:*:*:*:*:*:*",
        cpeNameId: "8390B4F7-3AC3-4E5C-A8C4-45B102F52743",
        lastModified: "2013-05-08T14:49:12.080",
        created: "2013-04-30T15:34:27.407",
        titles: [
          {
            title: "Haxx Curl 7.21.6",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.5:*:*:*:*:*:*:*",
        cpeNameId: "0AFEA6FE-F627-4ED1-AE19-687DFF36512C",
        lastModified: "2013-05-08T14:49:12.037",
        created: "2013-04-30T15:34:27.467",
        titles: [
          {
            title: "Haxx Curl 7.21.5",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.4:*:*:*:*:*:*:*",
        cpeNameId: "E6E5A5F9-15B9-46A3-A903-2867E62D2741",
        lastModified: "2013-05-08T14:49:11.997",
        created: "2013-04-30T15:34:27.527",
        titles: [
          {
            title: "Haxx Curl 7.21.4",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.3:*:*:*:*:*:*:*",
        cpeNameId: "C10D1152-8CFB-4CA1-A5AE-F5EA70D4D2F3",
        lastModified: "2013-05-08T14:49:11.950",
        created: "2013-04-30T15:34:27.587",
        titles: [
          {
            title: "Haxx Curl 7.21.3",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.2:*:*:*:*:*:*:*",
        cpeNameId: "4A0DBAFF-EEAC-4938-846D-3DE9887E83B2",
        lastModified: "2013-05-08T14:49:11.907",
        created: "2013-04-30T15:34:27.647",
        titles: [
          {
            title: "Haxx Curl 7.21.2",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.1:*:*:*:*:*:*:*",
        cpeNameId: "89121AFF-19D3-47E7-B74E-1CB614835E0C",
        lastModified: "2013-05-08T14:49:11.867",
        created: "2013-04-30T15:34:27.707",
        titles: [
          {
            title: "Haxx Curl 7.21.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.21.0:*:*:*:*:*:*:*",
        cpeNameId: "B770C13D-A96A-4616-A4ED-7D2ED561BD4F",
        lastModified: "2013-05-08T14:49:11.827",
        created: "2013-04-30T15:34:27.767",
        titles: [
          {
            title: "Haxx Curl 7.21.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.20.1:*:*:*:*:*:*:*",
        cpeNameId: "55718E2B-88E7-4334-B3CC-72C968146CA5",
        lastModified: "2013-05-08T14:49:11.783",
        created: "2013-04-30T15:34:27.867",
        titles: [
          {
            title: "Haxx Curl 7.20.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.20.0:*:*:*:*:*:*:*",
        cpeNameId: "7E63AA1A-FCE3-4D28-847A-5088E20BB7EB",
        lastModified: "2013-05-08T14:49:11.743",
        created: "2013-04-30T15:34:27.943",
        titles: [
          {
            title: "Haxx Curl 7.20.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.7:*:*:*:*:*:*:*",
        cpeNameId: "D3BABF61-26AE-4F6B-A34D-F7740E564345",
        lastModified: "2013-05-08T14:49:11.607",
        created: "2013-04-30T15:34:28.003",
        titles: [
          {
            title: "Haxx Curl 7.19.7",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.6:*:*:*:*:*:*:*",
        cpeNameId: "E5C447B7-3AC6-4603-A737-F9BCFC22147A",
        lastModified: "2013-05-08T14:49:11.560",
        created: "2013-04-30T15:34:28.063",
        titles: [
          {
            title: "Haxx Curl 7.19.6",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.5:*:*:*:*:*:*:*",
        cpeNameId: "7E7CD3B7-C088-491F-9DC7-020013776F50",
        lastModified: "2013-05-08T14:49:11.517",
        created: "2013-04-30T15:34:28.127",
        titles: [
          {
            title: "Haxx Curl 7.19.5",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.4:*:*:*:*:*:*:*",
        cpeNameId: "9A45EECB-1F56-41DA-8013-F40987DB004E",
        lastModified: "2013-05-08T14:49:11.477",
        created: "2013-04-30T15:34:28.187",
        titles: [
          {
            title: "Haxx Curl 7.19.4",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.3:*:*:*:*:*:*:*",
        cpeNameId: "C28FB540-2F47-4C00-AB1F-88CC3694238B",
        lastModified: "2013-05-08T14:49:11.430",
        created: "2013-04-30T15:34:28.250",
        titles: [
          {
            title: "Haxx Curl 7.19.3",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.2:*:*:*:*:*:*:*",
        cpeNameId: "DCD6C637-E7B3-4E34-9B0C-00E85B7FB56F",
        lastModified: "2013-05-08T14:49:11.390",
        created: "2013-04-30T15:34:28.310",
        titles: [
          {
            title: "Haxx Curl 7.19.2",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.1:*:*:*:*:*:*:*",
        cpeNameId: "FD6D674B-F4AA-444E-AC77-3D292E4FDF15",
        lastModified: "2013-05-08T14:49:11.350",
        created: "2013-04-30T15:34:28.373",
        titles: [
          {
            title: "Haxx Curl 7.19.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.19.0:*:*:*:*:*:*:*",
        cpeNameId: "0795BC5E-C10F-448D-82EB-68D41DADE280",
        lastModified: "2013-05-08T14:49:11.310",
        created: "2013-04-30T15:34:28.433",
        titles: [
          {
            title: "Haxx Curl 7.19.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.18.2:*:*:*:*:*:*:*",
        cpeNameId: "2C854AC1-387A-491A-9118-F9A811574218",
        lastModified: "2013-05-08T14:49:11.267",
        created: "2013-04-30T15:34:28.527",
        titles: [
          {
            title: "Haxx Curl 7.18.2",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.18.1:*:*:*:*:*:*:*",
        cpeNameId: "4F84C910-0891-4FBE-B5BE-17C92CAE16C3",
        lastModified: "2013-05-08T14:49:11.230",
        created: "2013-04-30T15:34:28.630",
        titles: [
          {
            title: "Haxx Curl 7.18.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.18.0:*:*:*:*:*:*:*",
        cpeNameId: "B2BA6BD7-83DE-4AAB-97A1-C04765DD472C",
        lastModified: "2013-05-08T14:49:11.190",
        created: "2013-04-30T15:34:28.760",
        titles: [
          {
            title: "Haxx Curl 7.18.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.29.0:*:*:*:*:*:*:*",
        cpeNameId: "8590E0AF-79EE-4592-89AA-C77942F0FCC3",
        lastModified: "2013-05-08T14:49:12.583",
        created: "2013-04-30T15:34:28.863",
        titles: [
          {
            title: "Haxx Curl 7.29.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.17.1:*:*:*:*:*:*:*",
        cpeNameId: "A582ED36-D425-4D1A-93D4-7F39DFA44E70",
        lastModified: "2013-05-08T14:49:11.150",
        created: "2013-04-30T15:36:49.807",
        titles: [
          {
            title: "Haxx Curl 7.17.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.17.0:*:*:*:*:*:*:*",
        cpeNameId: "190CF91E-EF10-42F6-9C02-62C0A557F2DB",
        lastModified: "2013-05-08T14:49:11.103",
        created: "2013-04-30T15:36:49.867",
        titles: [
          {
            title: "Haxx Curl 7.17.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.16.4:*:*:*:*:*:*:*",
        cpeNameId: "111615A9-3900-47B7-BF53-28352DA07314",
        lastModified: "2013-05-08T14:49:11.060",
        created: "2013-04-30T15:36:49.930",
        titles: [
          {
            title: "Haxx Curl 7.16.4",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.16.3:*:*:*:*:*:*:*",
        cpeNameId: "9D001DD9-8525-4486-BFB8-C49B4C8DC109",
        lastModified: "2013-05-08T14:49:11.020",
        created: "2013-04-30T15:36:49.990",
        titles: [
          {
            title: "Haxx Curl 7.16.3",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.16.2:*:*:*:*:*:*:*",
        cpeNameId: "7DADBFE7-9C4D-4B0A-B72C-61B77234340C",
        lastModified: "2013-05-08T14:49:10.980",
        created: "2013-04-30T15:36:50.053",
        titles: [
          {
            title: "Haxx Curl 7.16.2",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.16.1:*:*:*:*:*:*:*",
        cpeNameId: "6C8260A9-3FAB-4E9D-8431-8E08CDDE2D1C",
        lastModified: "2013-05-08T14:49:10.940",
        created: "2013-04-30T15:36:50.127",
        titles: [
          {
            title: "Haxx Curl 7.16.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.16.0:*:*:*:*:*:*:*",
        cpeNameId: "28BDE1DF-99B9-43CA-9A83-3552F707C5BB",
        lastModified: "2013-05-08T14:49:10.897",
        created: "2013-04-30T15:36:50.190",
        titles: [
          {
            title: "Haxx Curl 7.16.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.15.5:*:*:*:*:*:*:*",
        cpeNameId: "6A4B14A2-6D42-40CC-8829-DCB61336BB00",
        lastModified: "2013-05-08T14:49:10.857",
        created: "2013-04-30T15:36:50.250",
        titles: [
          {
            title: "Haxx Curl 7.15.5",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.15.4:*:*:*:*:*:*:*",
        cpeNameId: "9943FCD0-C9CC-490A-ABD0-2A78F02B2F96",
        lastModified: "2013-05-08T14:49:10.817",
        created: "2013-04-30T15:36:50.313",
        titles: [
          {
            title: "Haxx Curl 7.15.4",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.15.3:*:*:*:*:*:*:*",
        cpeNameId: "BE8896D6-3622-45C9-AC03-D14C7CCC55FE",
        lastModified: "2013-05-08T14:49:10.773",
        created: "2013-04-30T15:36:50.377",
        titles: [
          {
            title: "Haxx Curl 7.15.3",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.15.2:*:*:*:*:*:*:*",
        cpeNameId: "9F5A2C37-CDD2-4EA4-8AC6-C839D8397735",
        lastModified: "2013-05-08T14:49:10.733",
        created: "2013-04-30T15:36:50.437",
        titles: [
          {
            title: "Haxx Curl 7.15.2",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.15.1:*:*:*:*:*:*:*",
        cpeNameId: "579C4E34-4A37-484F-A80C-BAB12C41162F",
        lastModified: "2013-05-08T14:49:10.693",
        created: "2013-04-30T15:36:50.500",
        titles: [
          {
            title: "Haxx Curl 7.15.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.15.0:*:*:*:*:*:*:*",
        cpeNameId: "4F9A441B-12F4-41EF-B1EF-105EFF9F6499",
        lastModified: "2013-05-08T14:49:09.697",
        created: "2013-04-30T15:36:50.563",
        titles: [
          {
            title: "Haxx Curl 7.15.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.14.1:*:*:*:*:*:*:*",
        cpeNameId: "5C9DD2D9-7905-4969-A79F-5DAB472A1B73",
        lastModified: "2013-05-08T14:49:09.657",
        created: "2013-04-30T15:36:50.627",
        titles: [
          {
            title: "Haxx Curl 7.14.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.1:*:*:*:*:*:*:*",
        cpeNameId: "F22AEDD7-9ACD-45FD-A510-B349D82F347D",
        lastModified: "2013-05-08T14:49:08.713",
        created: "2013-04-30T15:36:50.687",
        titles: [
          {
            title: "Haxx Curl 7.1",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.14.0:*:*:*:*:*:*:*",
        cpeNameId: "1F024940-3622-404F-B3BE-7A1C5F24223F",
        lastModified: "2013-05-08T14:49:09.610",
        created: "2013-04-30T16:35:59.260",
        titles: [
          {
            title: "Haxx Curl 7.14.0",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.13.2:*:*:*:*:*:*:*",
        cpeNameId: "9C0BAC21-720A-49D8-8532-3630420CC27E",
        lastModified: "2013-05-08T14:49:09.573",
        created: "2013-04-30T16:35:59.353",
        titles: [
          {
            title: "Haxx Curl 7.13.2",
            lang: "en",
          },
        ],
      },
    },
    {
      cpe: {
        deprecated: false,
        cpeName: "cpe:2.3:a:haxx:curl:7.13.1:*:*:*:*:*:*:*",
        cpeNameId: "28299396-0CDF-48A1-A33F-D01446E650A5",
        lastModified: "2013-05-08T14:49:09.507",
        created: "2013-04-30T16:35:59.417",
        titles: [
          {
            title: "Haxx Curl 7.13.1",
            lang: "en",
          },
        ],
      },
    },
  ];
  beforeEach(() => (instance = new CpeDictionaryList()));
  afterAll(() => (instance = null));

  describe("getCorrectCpeName", () => {
    it("Should return the Cpe string with correct vendor", () => {
        inputData.forEach((item)=>instance?.push(item.cpe));

        const result = instance?.getCorrectCpeName("cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*","cpe:2.3:a:reqtvi:curl:7.13.1:*:*:*:*:*:*:*");

        expect(result).toStrictEqual("cpe:2.3:a:haxx:curl:7.13.1:*:*:*:*:*:*:*");
    });

    it("should return the Cpe string with the operating system provider", () => {
        const item = [{
          deprecated: false,
          cpeName: "cpe:2.3:a:redhat:curl:7.13.1:*:*:*:*:*:*:*",
          cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
          lastModified: "2013-05-08T14:49:12.543",
          created: "2013-05-08T14:49:12.543",
          titles: [
            {
              title: "Haxx Curl 7.28.1",
              lang: "en",
            },
          ],
          refs: [],
          deprecatedBy: []
        },
      ]
       instance?.push(item[0]);

        const result = instance?.getCorrectCpeName("cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*","cpe:2.3:a:reqtvi:curl:7.28.1:*:*:*:*:*:*:*");
        expect(result).toStrictEqual("cpe:2.3:a:redhat:curl:7.28.1:*:*:*:*:*:*:*");
    });
    it("should return the string Cpe with the operating system provider, having a cpe in the list with obsolete value", () => {
      const item = [
        {
          deprecated: true,
          cpeName: "cpe:2.3:a:valor_qualquer:curl:7.13.1:*:*:*:*:*:*:*",
          cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
          lastModified: "2013-05-08T14:49:12.543",
          created: "2013-05-08T14:49:12.543",
          titles: [
            {
              title: "Haxx Curl 7.28.1",
              lang: "en",
            },
          ],
          refs: [],
          deprecatedBy: [
            {
              cpeName: "cpe:2.3:a:redhat:curl:7.28.1:*:*:*:*:*:*:*",
              cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
            },
          ],
        },
      ];
      instance?.push(item[0]);

      const result = instance?.getCorrectCpeName(
        "cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*",
        "cpe:2.3:a:reqtvi:curl:7.13.1:*:*:*:*:*:*:*"
      );
      expect(result).toStrictEqual(
        "cpe:2.3:a:redhat:curl:7.13.1:*:*:*:*:*:*:*"
      );
    });
    it("must return the Cpe string with the correct provider using the vendor that appears most in the list of CPEs", () => {
     
      inputData.forEach((item)=>instance?.push(item.cpe));
      const result = instance?.getCorrectCpeName(
        "cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*",
        "cpe:2.3:a:reqtvi:curl:7.31.1:*:*:*:*:*:*:*"
      );
      expect(result).toStrictEqual(
        "cpe:2.3:a:haxx:curl:7.31.1:*:*:*:*:*:*:*");
    });
    it("must return the Cpe string with the correct provider using the vendor that appears most in the list of CPEs, having a cpe in the list with an obsolete value", () => {
      
      const items = [
            {
              deprecated: true,
              cpeName: "cpe:2.3:a:valor_qualquer:curl:7.13.1:*:*:*:*:*:*:*",
              cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
              lastModified: "2013-05-08T14:49:12.543",
              created: "2013-05-08T14:49:12.543",
              titles: [
                {
                  title: "Haxx Curl 7.28.1",
                  lang: "en",
                },
              ],
              refs: [],
              deprecatedBy: [
                {
                  cpeName: "cpe:2.3:a:haxx:curl:7.28.1:*:*:*:*:*:*:*",
                  cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
                },
              ],
            },
            {
              deprecated: true,
              cpeName: "cpe:2.3:a:valor_qualquer:curl:7.13.1:*:*:*:*:*:*:*",
              cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
              lastModified: "2013-05-08T14:49:12.543",
              created: "2013-05-08T14:49:12.543",
              titles: [
                {
                  title: "Haxx Curl 7.28.1",
                  lang: "en",
                },
              ],
              refs: [],
              deprecatedBy: [
                {
                  cpeName: "cpe:2.3:a:haxx:curl:7.28.1:*:*:*:*:*:*:*",
                  cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
                },
              ],
            },
            {
              deprecated: true,
              cpeName: "cpe:2.3:a:valor_qualquer:curl:7.13.1:*:*:*:*:*:*:*",
              cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
              lastModified: "2013-05-08T14:49:12.543",
              created: "2013-05-08T14:49:12.543",
              titles: [
                {
                  title: "Haxx Curl 7.28.1",
                  lang: "en",
                },
              ],
              refs: [],
              deprecatedBy: [
                {
                  cpeName: "cpe:2.3:a:haxx:curl:7.28.1:*:*:*:*:*:*:*",
                  cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
                },
              ],
            },
            {
              deprecated: true,
              cpeName: "cpe:2.3:a:valor_qualquer:curl:7.13.1:*:*:*:*:*:*:*",
              cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
              lastModified: "2013-05-08T14:49:12.543",
              created: "2013-05-08T14:49:12.543",
              titles: [
                {
                  title: "Haxx Curl 7.28.1",
                  lang: "en",
                },
              ],
              refs: [],
              deprecatedBy: [
                {
                  cpeName: "cpe:2.3:a:haxx:curl:7.28.1:*:*:*:*:*:*:*",
                  cpeNameId: "C0A928C6-2B6F-48D2-9C89-B324AE19E7A5",
                },
              ],
            },
          ];
      items.forEach((item)=>instance?.push(item));
      const result = instance?.getCorrectCpeName(
        "cpe:2.3:o:redhat:enterprise_linux:9.5:*:*:*:*:*:*:*",
        "cpe:2.3:a:reqtvi:curl:7.31.1:*:*:*:*:*:*:*"
      );
      expect(result).toStrictEqual(
        "cpe:2.3:a:haxx:curl:7.31.1:*:*:*:*:*:*:*"
      );
    });
  });
  describe("length", ()=>{
    it("should return the integer value 49", ()=>{
      inputData.forEach((item)=>instance?.push(item.cpe));
      expect(instance).toHaveLength(49);
    });
  });
});
