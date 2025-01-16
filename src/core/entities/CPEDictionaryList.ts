import { cpeDictionary, deprecatedBy, ref, title } from "./types/CPEDictionary";

export class CpeDictionaryList {
  private cpeDictionary: cpeDictionary[] = [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public push(data: any): void {
    const item: cpeDictionary = {
      deprecated: false,
      cpeName: "",
      cpeNameId: "",
      lastModified: undefined,
      created: undefined,
      titles: [],
      refs: [],
      deprecatedBy: [],
    };
    item.deprecated = data.deprecated;
    item.cpeName = data.cpeName;
    item.cpeNameId = data.cpeNameId;
    item.lastModified = new Date(data.lastModified);
    item.created = new Date(data.created);
    item.titles = data.titles
      ? data.titles.map((title: title) => ({
          title: title.title,
          lang: title.lang,
        }))
      : [];
    item.refs = data.refs
      ? data.refs.map((ref: ref) => ({ ref: ref.ref }))
      : [];
    item.deprecatedBy = data.deprecatedBy
      ? data.deprecatedBy.map((deprecated: deprecatedBy) => ({
          cpeName: deprecated.cpeName,
          cpeNameId: deprecated.cpeNameId,
        }))
      : [];

    this.cpeDictionary.push(item);
  }

  public getCorrectCpeName(os: string, cpeOriginal: string): string {
  
    const sanitizeOSName = os.split("_")[0];
    const parts = sanitizeOSName.split(':');
    
    // Evaluates whether the CPE has a relationship with the original CPE version
    let cpeCorrectWithVersion: cpeDictionary | undefined = undefined;
    for (const cpeItem of this.cpeDictionary) {
      if (cpeItem.deprecated) {
        if (this.extractVersion(cpeItem.deprecatedBy[0].cpeName) == this.extractVersion(cpeOriginal)) {
          cpeCorrectWithVersion = cpeItem;
          break;
        }
      } else {
        if (this.extractVersion(cpeItem.cpeName) == this.extractVersion(cpeOriginal)) {
          cpeCorrectWithVersion = cpeItem;
          break;
        }
      }
    }
    
    if (cpeCorrectWithVersion) {
      if (cpeCorrectWithVersion.deprecated) {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithVersion.deprecatedBy[0].cpeName) ??
          sanitizeOSName
        );
      } else {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithVersion.cpeName) ?? sanitizeOSName
        );
      }
    }
    
    
    
    // Evaluates whether the CPE is related to the Operating System
    
    let cpeCorrectWithOS: cpeDictionary | undefined = undefined;
    
    for (const cpeItem of this.cpeDictionary) {
      if (cpeItem.deprecated) {
        if (cpeItem.deprecatedBy[0].cpeName.includes(parts[3]) || cpeItem.deprecatedBy[0].cpeName.includes(parts[4])) {
          cpeCorrectWithOS = cpeItem;
          break;
        }
      } else {
        
        // Check if the operating system vendor and product are related to the CPE
        if (cpeItem.cpeName.includes(parts[3]) || cpeItem.cpeName.includes(parts[4])) {
          cpeCorrectWithOS = cpeItem;
          break;
        }
      }
    }
    // Using the second path determined by the project to find the correct CPE with higher probability
    if (cpeCorrectWithOS) {
      if (cpeCorrectWithOS.deprecated) {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithOS.deprecatedBy[0].cpeName) ??
          sanitizeOSName
        );
      } else {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithOS.cpeName) ?? sanitizeOSName
        );
      }
    }
    // Get the vendor that repeats the most
    if (cpeCorrectWithOS == undefined) {
      // If it is not a system from the operating system package
      const vendors: string[] = [];
      let cpeCorrect: string | undefined = undefined;
      
      
      for (const cpeItem of this.cpeDictionary) {
        if (cpeItem.deprecated) {
          if (cpeItem.deprecatedBy[0].cpeName ? true : false) {
            const cpeParts = cpeItem.deprecatedBy[0].cpeName.split(":");
            vendors.push(cpeParts[3]);
          }
        } else {
          if (cpeItem.cpeName ? true : false) {
            const cpeParts = cpeItem.cpeName.split(":");
            vendors.push(cpeParts[3]);
          }
        }
      }
      // Using the third path determined by the project to find the correct CPE with the highest probability
      cpeCorrect = this.mostOccurringWord(vendors)
      if (cpeCorrect) {
        return this.replaceVendor(
              cpeOriginal,
              cpeCorrect
            );
      }
    }
    return this.replaceVendor(cpeOriginal, sanitizeOSName);
  }

  private replaceVendor(cpe: string, newVendor: string): string {
    return cpe.replace(/(cpe:2\.3:a:)[^:]+/, `$1${newVendor}`);
  }

  private extractVendor(cpe: string): string | null {
    // Usa regex para capturar o campo vendor
    const match = cpe.match(/cpe:2\.3:a:([^:]+):/);

    // Retorna o vendor se encontrado, ou null caso contrário
    return match ? match[1] : null;
  }

  private extractVersion(cpe: string): string {
    const part = cpe.split(":");
    const match = part[5].split(/[-_]/);
    return match ? match[0] : ''; // Returns the found version or an empty string
}


  private mostOccurringWord(words: string[]): string {
    const counter: Record<string, number> = {};

    // Count the repetition of each word
    for (const word of words) {
      counter[word] = (counter[word] || 0) + 1;
    }

    // Find the word with the most mentions
    let mostOccurring = "";
    let maxRepetitions = 0;

    for (const [word, repetitions] of Object.entries(counter)) {
      if (repetitions > maxRepetitions) {
        mostOccurring = word;
        maxRepetitions = repetitions;
      }
    }

    return mostOccurring;
  }

  public get length(): number {
    return this.cpeDictionary.length;
  }
}
