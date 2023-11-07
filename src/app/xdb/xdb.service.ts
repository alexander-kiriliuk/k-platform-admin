import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {StringUtils} from "../global/util/string.utils";
import fillParams = StringUtils.fillParams;

@Injectable()
export class XdbService {

  private readonly http = inject(HttpClient);

  importData(data: string) {
    const validXml = this.ensureValidXml(data);
    return this.http.post<void>("/xdb/import", validXml, {
      headers: new HttpHeaders().append("Content-Type", "application/xml")
    });
  }

  exportData(target: string, id: string) {
    return this.http.get<string>(fillParams("/xdb/export/:target/:id", target, id));
  }

  private ensureValidXml(data: string): string {
    const startTag = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><schema>";
    const endTag = "</schema>";
    if (!data.trim().startsWith("<?xml")) {
      data = startTag + data + endTag;
    }
    return data;
  }

}
