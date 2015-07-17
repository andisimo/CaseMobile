using CrmEarlyBound;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace WebRole1.Controllers
{
    [DataContract]
    public class OffenseObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string Name
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? BeginDate
        {
            get;
            set;
        }

        [DataMember]
        public Guid ContactId
        {
            get;
            set;
        }

        [DataMember]
        public string Details
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? EndDate
        {
            get;
            set;
        }

        [DataMember]
        public bool? Incarcerated
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? OffenseDate
        {
            get;
            set;
        }

        [DataMember]
        public int? OffenseType
        {
            get;
            set;
        }

        [DataMember]
        public string OffenseTypeString
        {
            get;
            set;
        }

        [DataMember]
        public bool? OnParole
        {
            get;
            set;
        }

        [DataMember]
        public bool? OnProbation
        {
            get;
            set;
        }
    }

    public class OffensesController : ApiController
    {
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://childsafety.crm.dynamics.com; Username=; Password=");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from d in ctx.new_offenseSet
                        select new OffenseObject
                        {
                            Id = d.Id,
                            Name = d.new_name,
                            BeginDate = d.new_BeginDate,
                            ContactId = d.new_ContactOffensesId.Id,
                            Details = d.new_Details, 
                            EndDate = d.new_EndDate,
                            Incarcerated = d.new_Incarcerated,
                            OffenseDate = d.new_OffenseDate,
                            OffenseType = d.new_OffenseType,
                            OnParole = d.new_OnParole,
                            OnProbation = d.new_OnProbation
                        };

            var queryResults = query.ToList();

            foreach (OffenseObject o in queryResults)
            {
                switch (o.OffenseType)
                {
                    case 100000000:
                        o.OffenseTypeString = "Violence";
                        break;
                    case 100000001:
                        o.OffenseTypeString = "Weapons";
                        break;
                    case 100000002:
                        o.OffenseTypeString = "Drug Related";
                        break;
                    case 100000003:
                        o.OffenseTypeString = "Other";
                        break;
                }
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                queryResults);
        }
    }
}
