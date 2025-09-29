using AutoMapper;
using InsuranceApi.DTOs;
using InsuranceApi.Models;

namespace InsuranceApi.Mappings;
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Vehicle
        CreateMap<Vehicle, VehicleDto>().ReverseMap();
        CreateMap<CreateVehicleDto, Vehicle>();
        CreateMap<UpdateVehicleDto, Vehicle>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Insurance Policy
        CreateMap<InsurancePolicy, InsurancePolicyDto>().ReverseMap();
        CreateMap<CreateInsurancePolicyDto, InsurancePolicy>();

        // Quotation
        CreateMap<Quotation, InsurancePolicyDto>().ReverseMap();
        CreateMap<CreateInsuranceQuoteDto, Quotation>();

        // Payment
        CreateMap<CreatePaymentDto, Payment>().ReverseMap();
        CreateMap<Payment, PaymentDto>();
    }
}
