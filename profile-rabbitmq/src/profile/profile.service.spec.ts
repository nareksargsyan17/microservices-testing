import {Test ,TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
let moks = require("node-mocks-http")
import * as jwt from 'jsonwebtoken';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './entity/Profile';
describe("ProfileService", ()=>{
    let service : ProfileService;
    let mockRepository = {
        save: jest.fn((data)=>{
            return {
                id : Date.now(),
                ...data
            }
        }),
        find: jest.fn(() => [
            { 
                id : expect.any(Number),
                userId: 4,
                firstName: "name",
                lastName : "lastName",
                phone : 5555, 
            }, 
            { 
                id : expect.any(Number),
                userId: 5,
                firstName: "name1",
                lastName : "lastName1",
                phone : 5555, 
            }]),
        delete : jest.fn((id)=>{
            return "deleted"
        }),
        update: jest.fn((id, dto)=>{
            return { generatedMaps: [], raw: [], affected: 1 }
        }),

        findOneBy: jest.fn(({id})=>{
            return { 
                id : id,
                userId: id,
                firstName: expect.any(String),
                lastName : expect.any(String),
                phone : expect.any(Number) 
            }
        })
    }
    beforeEach(async ()=>{
        const module : TestingModule = await Test.createTestingModule({
            providers : [ProfileService, {
                provide : getRepositoryToken(Profile),
                useValue : mockRepository
            }],
        }).compile();
        service = module.get<ProfileService>(ProfileService);
    });

    it('shoud be defined', ()=>{
        expect(service).toBeDefined();
    })

    it("shoud be create profile", async ()=>{
        const data = {
            userId: 4,
            firstName: "Paul",
            lastName : "Pogba",
            phone : 3547,
        }
        expect(await service.createProfile(data)).toEqual({
            id : expect.any(Number),
            userId: data.userId,
            firstName: data.firstName,
            lastName : data.lastName,
            phone : data.phone,
        })
    })

    it("shoud be get all profiles", async ()=>{
        expect(await service.get()).toEqual(expect.arrayContaining([
            expect.objectContaining({ 
                id : expect.any(Number),
                userId: expect.any(Number),
                firstName: expect.any(String),
                lastName : expect.any(String),
                phone : expect.any(Number), })
          ]));
    })

    it("shoud be delete profile", async ()=>{
        expect(await service.delete(1)).toEqual("deleted");
    })

    it("shoud be update profile", async ()=>{
        const data = {
            userId: 4,
            firstName: "Paul",
            lastName : "Pogba",
            phone : 3547,
        }
        expect(await service.update(4, data)).toEqual({
            id: 4,
            userId: data.userId,
            firstName: data.firstName,
            lastName : data.lastName,
            phone : data.phone,
        });
    })
})