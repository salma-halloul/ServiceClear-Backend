import { Request, Response } from "express";
import { Service } from "../models/service.entity";
import { AppDataSource } from "../config/data-source";
import { Category } from "../models/category.entity";
import { cacheService } from "../services/cache.service";


export class ServiceController {
    static async createService(req: Request, res: Response): Promise<Response> {
        const { name, description, categoryIds, images, visible} = req.body;

        if ( !name || !description || !categoryIds || !images || visible === undefined) {
            return res.status(400).json({ message: "Name, description, and at least one category are required" });
        }
        
        const ServiceRepository = AppDataSource.getRepository(Service);
        const categoryRepository = AppDataSource.getRepository(Category);

        try {

            const categories = await categoryRepository.findByIds(categoryIds);
            if (categories.length !== categoryIds.length) {
                return res.status(404).json({ message: "One or more categories not found" });
            }

            const service = new Service();
            service.name = name;
            service.description = description;
            service.categories = categories;
            service.images = images;
            service.visible = visible;
            service.createdAt = new Date();

            await ServiceRepository.save(service);

            return res.status(201).json(service);
        } catch (error: unknown) {
            console.error('Error in createService:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(500).json({ message: "Error creating service", error: errorMessage });
        }
    }

    static async getAllVisibleServices(req: Request, res: Response): Promise<Response> {
        try {
         /* const CACHE_KEY = `visible_Services`;
    
          // Try to get from cache first
          const cachedData = await cacheService.get(CACHE_KEY);
          if (cachedData) {
            return res.json(cachedData);
          }*/
    
          const serviceRepository = AppDataSource.getRepository(Service);
          const visibleServices = await serviceRepository.find({ where: { visible: true } });
    
          // Save to cache
         // await cacheService.set(CACHE_KEY, visibleServices);
    
          return res.json(visibleServices);
        } catch (error) {
          console.error("Error fetching visible services:", error);
          return res.status(500).json({ message: "Error fetching visible services" });
        }
    }

   

    static async getAllServices(req: Request, res: Response): Promise<Response> {
        const ServiceRepository = AppDataSource.getRepository(Service);

        try {
            const [Services] = await ServiceRepository.findAndCount({
                relations: ["categories"],
            });

            const mappedServices = Services.map(service => ({
                id: service.id,
                images: service.images,
                name: service.name,
                visible: service.visible,
                categories: service.categories.map(category => ({
                    id: category.id,
                    name: category.name,
                })),
            }));

            return res.json({
                data: mappedServices,
            });
        } catch (error: unknown) {
            console.error('Error in getAllServices:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(500).json({ message: "Error retrieving Services", error: errorMessage });
        }
    }

    static async updateService(req: Request, res: Response): Promise<Response> {
        const {id} = req.params; 

        const { name, description, categoryIds, images, visible } = req.body;
    
        const ServiceRepository = AppDataSource.getRepository(Service);
        const categoryRepository = AppDataSource.getRepository(Category);
    
        try {
            const service = await ServiceRepository.findOne({
                where: { id },
                relations: ["categories"],
            });
    
            if (!service) {
                return res.status(404).json({ message: "service not found" });
            }
    
            if (name) {
                service.name = name;
            }
            if (description) {
                service.description = description;
            }

            if (categoryIds && categoryIds.length > 0) {
                const categories = await categoryRepository.findByIds(categoryIds);
                if (categories.length !== categoryIds.length) {
                    return res.status(404).json({ message: "One or more categories not found" });
                }
                service.categories = categories;
            }
           
            
            if (images) {
                service.images = images;
            }
    
            if (visible !== undefined) {
                service.visible = visible;
            }

            await ServiceRepository.save(service);
    
            return res.status(200).json(service);
        } catch (error: unknown) {
            console.error('Error in updateService:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(500).json({ message: "Error updating service", error: errorMessage });
        }
    }
    

    static async getServiceById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params; 

        const ServiceRepository = AppDataSource.getRepository(Service); 
    
        try {
            const service = await ServiceRepository.findOne({ where: { id } , relations: ["categories"],}); 
            if (!service) {
                return res.status(404).json({ message: "service not found" }); 
            }
            return res.json(service); 
        } catch (error: unknown) {
            console.error('Error in getServiceById:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(500).json({ message: "Error retrieving service", error: errorMessage });
        }
    }

      static async deleteMultipleServices(req: Request, res: Response): Promise<Response> {
        const { ids } = req.body;
    
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ message: "No service IDs provided" });
        }
    
        const ServiceRepository = AppDataSource.getRepository(Service);
    
        try {
          const Services = await ServiceRepository.findByIds(ids);
    
          if (Services.length === 0) {
            return res.status(404).json({ message: "No Services found with the provided IDs" });
          }
    
          // Supprimer les produits
          await ServiceRepository.remove(Services);
    
          return res.status(200).json({ message: "Services deleted successfully", ids });
        } catch (error: unknown) {
            console.error('Error in deleteMultipleServices:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(500).json({ message: "Error deleting Services", error: errorMessage });
        }
    }
    

      
}
