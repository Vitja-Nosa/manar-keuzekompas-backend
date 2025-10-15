import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Vkm } from './vkm.schema';

function normalizeLevel(level?: string) {
  if (!level) return undefined;
  // maak NLQF5 -> NLQF-5 en NLQF6 -> NLQF-6
  return level.replace(/^NLQF(\d)$/i, 'NLQF-$1');
}

function toApiModel(doc: any) {
  return {
    _id: doc._id,
    code: String(doc.id ?? doc._id),   // school-id uit data blijft leesbaar
    name: doc.name,
    description: doc.shortdescription ?? doc.description ?? '',
    ec: Number(doc.studycredit) || undefined,
    level: (doc.level || '').replace(/^NLQF(\d)$/i, 'NLQF-$1') || undefined,
    location: doc.location ?? null,
    contactId: doc.contact_id ?? null,
    learningoutcomes: doc.learningoutcomes ?? null,
  };
}

@Injectable()
export class VkmService {
  constructor(@InjectModel(Vkm.name) private model: Model<Vkm>) {}

  async findAll(params: { query?: string; ec?: number; level?: string; theme?: string; name?: string; }) {
    const filter: FilterQuery<Vkm> = {};

    // Filters mappen naar jouw kolommen
    if (params.ec) filter.studycredit = Number(params.ec);
    if (params.level) filter.level = new RegExp(params.level.replace('-', ''), 'i'); // accepteert NLQF5 of NLQF-5
    if (params.name) filter.name = new RegExp(params.name, 'i');

    if (params.query) {
      filter.$or = [
        { name: new RegExp(params.query, 'i') },
        { shortdescription: new RegExp(params.query, 'i') },
        { description: new RegExp(params.query, 'i') },
        { content: new RegExp(params.query, 'i') },
        { learningoutcomes: new RegExp(params.query, 'i') },
      ];
    }

    const docs = await this.model.find(filter).limit(100).lean();
    return docs.map(toApiModel);
  }

  async findById(id: string) {
    // support zowel Mongo _id als school 'id'
    const byMongo = await this.model.findById(id).lean();
    if (byMongo) return toApiModel(byMongo);
    const bySchoolId = await this.model.findOne({ id }).lean();
    return bySchoolId ? toApiModel(bySchoolId) : null;
  }

  // Create/Update alleen als je echt CRU op VKM wilt doen
  async create(dto: any) {
    const created = await this.model.create(dto);
    return toApiModel(created.toObject());
  }
  async update(id: string, dto: any) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    return updated ? toApiModel(updated) : null;
  }
}
