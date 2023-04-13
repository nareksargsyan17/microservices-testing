import {Test ,TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
let moks = require("node-mocks-http")
import * as jwt from 'jsonwebtoken';
describe("ProfileController", ()=>{
    let controller : ProfileController;
    let setup = async (config: JwtModuleOptions) => {
        const module = await Test.createTestingModule({
          imports: [JwtModule.register(config)]
        }).compile();
      
        return module.get<JwtService>(JwtService);
      };
    let jwtService : JwtService
    const mockProfileService = {
        createProfile: jest.fn(dto =>{
            return {
            id: Date.now(),
            ...dto
            }
        }),
        update: jest.fn().mockImplementation((id,dto) =>{
            return {
                id : id,
                ...dto
            }
        }),
        delete: jest.fn(()=>{
            return "deleted"
        })
    };

    beforeAll(async ()=>{
        jwtService = await setup({
            secret: 'secret',
            signOptions: { expiresIn: '1h' },
          })
    })

    beforeEach(async ()=>{
        const module : TestingModule = await Test.createTestingModule({
            controllers : [ProfileController],
            providers : [ProfileService, JwtService],
        }).overrideProvider(ProfileService).useValue(mockProfileService).compile();
        controller = module.get<ProfileController>(ProfileController);
    });

    it('shoud be defined', ()=>{
        expect(controller).toBeDefined();
    })

    it('should be create profile',async ()=>{
        const dto = {
            userId : 5,
            firstName: "Paul",
            lastName : "Pogba",
            phone : 3547,
        }
        expect(await controller.createProfile(dto)).toEqual({
            id : expect.any(Number),
            userId : +dto.userId,
            firstName : dto.firstName,
            lastName: dto.lastName,
            phone : +dto.phone,
        })
        expect(201)

        expect(mockProfileService.createProfile).toHaveBeenCalledWith(dto)
    })

    it("shoud be updated by user", async ()=>{
        let req = moks.createRequest();
        let jwt = await jwtService.signAsync({
            id: 2,
            role: false
        });
        const dto = {
            firstName: "Paul",
            lastName : "Pogba",
            phone : 3547,
        }
        req.cookies["jwt"] = jwt;
        let jwtId : any = jwtService.decode(req.cookies["jwt"]);
        jwtId = jwtId.id;
            expect(await controller.update(req, dto)).toEqual({
                data : {
                    id : jwtId,
                    firstName : dto.firstName,
                    lastName: dto.lastName,
                    phone : +dto.phone,
                },
                message : "updated by user"
            })

            expect(mockProfileService.update).toHaveBeenCalledWith(jwtId, dto)
        }
    )
    it("shoud be updated by admin", async ()=>{
        const dto = {
            userId : 5,
            firstName: "Paul",
            lastName : "Pogba",
            phone : 3547,
        }
        let req = moks.createRequest();
        let jwt = await jwtService.signAsync({
            id: dto.userId,
            role: true
        });
        req.cookies["jwt"] = jwt
            expect(await controller.update(req, dto)).toEqual({
                data : {
                    id : expect.any(Number),
                    userId : +dto.userId,
                    firstName : dto.firstName,
                    lastName: dto.lastName,
                    phone : +dto.phone,
                },
                message : "updated by admin"
            })

            expect(mockProfileService.update).toHaveBeenCalledWith(dto.userId, dto)
        }
    )

    it("shoud be return not found", async ()=>{
        let req = moks.createRequest();
        let jwt = await jwtService.signAsync({
            id: 3,
            role: false
        });
        const dto = {
            userId: 4,
            firstName: "Paul",
            lastName : "Pogba",
            phone : 3547,
        }
        req.cookies["jwt"] = jwt;
        let jwtId : any = jwtService.decode(req.cookies["jwt"]);
        jwtId = jwtId.id;
            expect(await controller.update(req, dto)).toEqual(
                 "not Found"
            )

        }
    )
    it("shoud be deleted profile", async ()=>{
        let req = moks.createRequest();
        let jwt = await jwtService.signAsync({
            id: 6,
            role: true
        });
        req.cookies["jwt"] = jwt;
        let jwtId : any = jwtService.decode(req.cookies["jwt"]);
        jwtId = jwtId.id;
        expect(await controller.deleteProfile(5)).toEqual("deleted")
    })
})